import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

async function uniqueSlug(baseSlug: string): Promise<string> {
  let candidate = `${baseSlug}-copy`;
  let counter = 2;
  while (await prisma.product.findUnique({ where: { slug: candidate } })) {
    candidate = `${baseSlug}-copy-${counter}`;
    counter += 1;
  }
  return candidate;
}

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const source = await prisma.product.findUnique({ where: { id } });
    if (!source) {
      return NextResponse.json({ ok: false, message: "Không tìm thấy sản phẩm" }, { status: 404 });
    }

    const slug = await uniqueSlug(source.slug);

    const copy = await prisma.product.create({
      data: {
        name: `${source.name} (Bản sao)`,
        slug,
        sku: null, // SKU phải là duy nhất — không copy để tránh trùng
        shortDesc: source.shortDesc,
        description: source.description,
        imageUrl: source.imageUrl,
        gallery: source.gallery ?? undefined,
        price: source.price,
        dealerPrice: source.dealerPrice,
        unit: source.unit,
        productLine: source.productLine,
        aluminumSystem: source.aluminumSystem,
        color: source.color,
        thickness: source.thickness,
        stockLength: source.stockLength,
        catalogUrl: source.catalogUrl,
        videoUrl: source.videoUrl,
        warrantyPolicy: source.warrantyPolicy,
        seoTitle: null, // để trống, tránh trùng SEO title với bản gốc
        seoDescription: null,
        ogImage: source.ogImage,
        specs: source.specs ?? undefined,
        isFeatured: false,
        status: "DRAFT", // luôn tạo ở trạng thái nháp, tránh vô tình công khai bản sao
        categoryId: source.categoryId,
        brandId: source.brandId
      }
    });

    return NextResponse.json({ ok: true, product: copy });
  } catch (error) {
    console.error("DUPLICATE_PRODUCT_ERROR", error);
    return NextResponse.json({ ok: false, message: "Không thể sao chép sản phẩm" }, { status: 500 });
  }
}
