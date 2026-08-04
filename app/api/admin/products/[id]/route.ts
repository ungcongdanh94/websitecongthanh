import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

async function requireAdmin() {
  return getAdminSession();
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    let gallery: string[] = [];
    try {
      const parsed = JSON.parse(body.gallery || "[]");
      if (Array.isArray(parsed)) gallery = parsed.filter((item) => typeof item === "string");
    } catch {
      gallery = [];
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: String(body.name || "").trim(),
        slug: String(body.slug || "").trim().toLowerCase(),
        sku: String(body.sku || "").trim() || null,
        shortDesc: String(body.shortDesc || "").trim() || null,
        description: String(body.description || "").trim() || null,
        imageUrl: String(body.imageUrl || "").trim() || null,
        gallery: gallery.length ? gallery : Prisma.DbNull,
        price: body.price ? Number(body.price) : null,
        dealerPrice: body.dealerPrice ? Number(body.dealerPrice) : null,
        unit: String(body.unit || "").trim() || null,
        productLine: String(body.productLine || "").trim() || null,
        aluminumSystem: String(body.aluminumSystem || "").trim() || null,
        color: String(body.color || "").trim() || null,
        thickness: String(body.thickness || "").trim() || null,
        stockLength: String(body.stockLength || "").trim() || null,
        catalogUrl: String(body.catalogUrl || "").trim() || null,
        videoUrl: String(body.videoUrl || "").trim() || null,
        status: ["PUBLISHED", "ARCHIVED"].includes(body.status) ? body.status : "DRAFT",
        categoryId: String(body.categoryId || ""),
        brandId: String(body.brandId || "").trim() || null,
        isFeatured: Boolean(body.isFeatured)
      }
    });

    return NextResponse.json({ ok: true, product });
  } catch (error) {
    console.error("UPDATE_PRODUCT_ERROR", error);
    return NextResponse.json(
      { ok: false, message: "Không thể cập nhật. Kiểm tra slug hoặc mã sản phẩm bị trùng." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE_PRODUCT_ERROR", error);
    return NextResponse.json(
      { ok: false, message: "Không thể xóa sản phẩm" },
      { status: 500 }
    );
  }
}
