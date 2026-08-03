import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brand = searchParams.get("brand")?.trim();
  const category = searchParams.get("category")?.trim();
  const system = searchParams.get("system")?.trim();

  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      ...(brand ? { brand: { slug: brand } } : {}),
      ...(category ? { category: { slug: category } } : {}),
      ...(system ? { aluminumSystem: { equals: system, mode: "insensitive" } } : {})
    },
    include: { category: true, brand: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }]
  });

  return NextResponse.json({
    ok: true,
    count: products.length,
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
      thickness: product.thickness === null ? null : Number(product.thickness),
      stockLength: product.stockLength,
      unit: product.unit,
      price: product.price === null ? null : Number(product.price),
      imageUrl: product.imageUrl,
      updatedAt: product.updatedAt
    }))
  });
}
