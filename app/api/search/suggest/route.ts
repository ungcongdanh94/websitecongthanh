import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  if (q.length < 2) {
    return NextResponse.json({ ok: true, results: [] });
  }

  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
        { aluminumSystem: { contains: q, mode: "insensitive" } },
        { productLine: { contains: q, mode: "insensitive" } }
      ]
    },
    select: { id: true, name: true, slug: true, imageUrl: true, price: true, unit: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    take: 6
  });

  return NextResponse.json({
    ok: true,
    results: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      imageUrl: p.imageUrl,
      price: p.price === null ? null : Number(p.price),
      unit: p.unit
    }))
  });
}
