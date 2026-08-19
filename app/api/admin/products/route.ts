import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { productSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const parsed = productSchema.safeParse({ ...body, slug: String(body.slug || "").trim().toLowerCase() });
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }
    const data = parsed.data;

    let gallery: string[] = [];
    try {
      const parsedGallery = JSON.parse(body.gallery || "[]");
      if (Array.isArray(parsedGallery)) gallery = parsedGallery.filter((item) => typeof item === "string");
    } catch {
      gallery = [];
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        sku: data.sku || null,
        shortDesc: data.shortDesc || null,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        gallery: gallery.length ? gallery : undefined,
        price: data.price === "" || data.price === undefined ? null : Number(data.price),
        dealerPrice: data.dealerPrice === "" || data.dealerPrice === undefined ? null : Number(data.dealerPrice),
        unit: data.unit || null,
        productLine: data.productLine || null,
        aluminumSystem: data.aluminumSystem || null,
        color: data.color || null,
        thickness: data.thickness || null,
        stockLength: data.stockLength || null,
        catalogUrl: data.catalogUrl || null,
        videoUrl: data.videoUrl || null,
        warrantyPolicy: data.warrantyPolicy || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        ogImage: data.ogImage || null,
        isFeatured: Boolean(body.isFeatured),
        status: ["PUBLISHED", "ARCHIVED"].includes(body.status) ? body.status : "DRAFT",
        categoryId: data.categoryId,
        brandId: data.brandId || null
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
