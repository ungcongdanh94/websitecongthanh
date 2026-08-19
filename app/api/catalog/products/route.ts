import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/apiAuth";
import { checkRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

export async function GET(request: Request) {
  const auth = await validateApiKey(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });
  }

  const apiKey = request.headers.get("x-api-key")!.trim();
  const { allowed, remaining } = checkRateLimit(apiKey);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, message: "Vượt quá giới hạn tần suất gọi API (60 lượt / phút). Thử lại sau." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand")?.trim();
  const category = searchParams.get("category")?.trim();
  const system = searchParams.get("system")?.trim();
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number.parseInt(searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
  );

  const where = {
    status: "PUBLISHED" as const,
    ...(brand ? { brand: { slug: brand } } : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(system ? { aluminumSystem: { equals: system, mode: "insensitive" as const } } : {})
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, brand: true },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.product.count({ where })
  ]);

  return NextResponse.json(
    {
      ok: true,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      hasMore: page * pageSize < total,
      products: products.map((product) => ({
        id: product.id,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        category: { name: product.category.name, slug: product.category.slug },
        brand: product.brand ? { name: product.brand.name, slug: product.brand.slug } : null,
        productLine: product.productLine,
        aluminumSystem: product.aluminumSystem,
        color: product.color,
        thickness: product.thickness,
        stockLength: product.stockLength,
        unit: product.unit,
        price: product.price === null ? null : Number(product.price),
        imageUrl: product.imageUrl,
        gallery: Array.isArray(product.gallery) ? product.gallery : [],
        catalogUrl: product.catalogUrl,
        updatedAt: product.updatedAt
      }))
    },
    { headers: { "X-RateLimit-Remaining": String(remaining) } }
  );
}
