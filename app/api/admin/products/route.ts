import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const slug = String(body.slug || "").trim().toLowerCase();
    const categoryId = String(body.categoryId || "").trim();

    let gallery: string[] = [];
    try {
      const parsed = JSON.parse(body.gallery || "[]");
      if (Array.isArray(parsed)) gallery = parsed.filter((item) => typeof item === "string");
    } catch {
      gallery = [];
    }

    if (!name || !slug || !categoryId) {
      return NextResponse.json(
        { ok: false, message: "Thiếu tên, slug hoặc danh mục" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        sku: String(body.sku || "").trim() || null,
        shortDesc: String(body.shortDesc || "").trim() || null,
        description: String(body.description || "").trim() || null,
        imageUrl: String(body.imageUrl || "").trim() || null,
        gallery: gallery.length ? gallery : undefined,
        price: body.price ? Number(body.price) : null,
        dealerPrice: body.dealerPrice ? Number(body.dealerPrice) : null,
        unit: String(body.unit || "").trim() || null,
        productLine: String(body.productLine || "").trim() || null,
        aluminumSystem: String(body.aluminumSystem || "").trim() || null,
        color: String(body.color || "").trim() || null,
        thickness: body.thickness ? Number(body.thickness) : null,
        stockLength: body.stockLength ? Number(body.stockLength) : null,
        catalogUrl: String(body.catalogUrl || "").trim() || null,
        videoUrl: String(body.videoUrl || "").trim() || null,
        isFeatured: Boolean(body.isFeatured),
        status: ["PUBLISHED", "ARCHIVED"].includes(body.status) ? body.status : "DRAFT",
        categoryId,
        brandId: String(body.brandId || "").trim() || null
      }
    });

    return NextResponse.json({ ok: true, product });
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR", error);
    return NextResponse.json(
      { ok: false, message: "Không thể tạo sản phẩm. Kiểm tra slug hoặc mã sản phẩm bị trùng." },
      { status: 500 }
    );
  }
}
