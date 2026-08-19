import { NextResponse } from "next/server";
import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

type ConfirmRow = {
  sku: string | null;
  name: string;
  slug: string;
  categorySlug: string | null;
  brandSlug: string | null;
  aluminumSystem: string | null;
  color: string | null;
  thickness: string | null;
  stockLength: string | null;
  unit: string | null;
  price: number | null;
  dealerPrice: number | null;
  shortDesc: string | null;
  status: "PUBLISHED" | "DRAFT";
};

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const rows: ConfirmRow[] = Array.isArray(body.rows) ? body.rows : [];
    const validRows = rows.filter((row) => row.name && row.slug && row.categorySlug);

    if (!validRows.length) {
      return NextResponse.json({ ok: false, message: "Không có dòng hợp lệ nào để nhập" }, { status: 400 });
    }

    const categories = await prisma.category.findMany({ select: { id: true, slug: true } });
    const brands = await prisma.brand.findMany({ select: { id: true, slug: true } });
    const categoryIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));
    const brandIdBySlug = new Map(brands.map((b) => [b.slug, b.id]));

    let created = 0;
    let updated = 0;
    const skipped: { row: string; reason: string }[] = [];

    for (const row of validRows) {
      const categoryId = categoryIdBySlug.get(row.categorySlug!);
      if (!categoryId) {
        skipped.push({ row: row.name, reason: "Không tìm thấy danh mục khi ghi dữ liệu" });
        continue;
      }

      const data = {
        name: row.name,
        sku: row.sku,
        shortDesc: row.shortDesc,
        aluminumSystem: row.aluminumSystem,
        color: row.color,
        thickness: row.thickness,
        stockLength: row.stockLength,
        unit: row.unit,
        price: row.price,
        dealerPrice: row.dealerPrice,
        status: row.status as PublishStatus,
        categoryId,
        brandId: row.brandSlug ? brandIdBySlug.get(row.brandSlug) ?? null : null
      };

      const existing = await prisma.product.findUnique({ where: { slug: row.slug } });
      await prisma.product.upsert({
        where: { slug: row.slug },
        update: data,
        create: { ...data, slug: row.slug }
      });

      if (existing) updated += 1;
      else created += 1;
    }

    return NextResponse.json({ ok: true, created, updated, skipped, skippedCount: rows.length - validRows.length });
  } catch (error) {
    console.error("IMPORT_CONFIRM_ERROR", error);
    return NextResponse.json({ ok: false, message: "Không thể nhập dữ liệu" }, { status: 500 });
  }
}
