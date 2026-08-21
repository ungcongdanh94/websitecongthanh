import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import { Download, PlayCircle, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductGallery from "@/components/ProductGallery";
import DatabaseProductCard from "@/components/DatabaseProductCard";
import type { PublicProduct } from "@/types/product";
import siteContent from "@/data/site-content.json";
import { splitValues, parseColorEntry } from "@/lib/productDisplay";
import { renderSafeMarkdown } from "@/lib/markdown";
import DOMPurify from "isomorphic-dompurify";
import RecentlyViewed from "@/components/RecentlyViewed";

export const dynamic = "force-dynamic";

const getProduct = cache(async (slug: string) => {
  return prisma.product.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true, brand: true }
  });
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Sản phẩm không tồn tại | CÔNG THẢNH" };
  }

  const description =
    product.seoDescription ||
    product.shortDesc ||
    product.description?.slice(0, 160) ||
    `${product.name} — ${product.category.name} chính hãng tại CÔNG THẢNH.`;

  const title = product.seoTitle || `${product.name} | CÔNG THẢNH`;
  const ogImage = product.ogImage || product.imageUrl;

  return {
    title,
    description,
    openGraph: {
      title: product.seoTitle || product.name,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined
    }
  };
}

function displayValue(value: unknown) {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Có" : "Không";
  return JSON.stringify(value);
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) notFound();

  const relatedRows = await prisma.product.findMany({
    where: { status: "PUBLISHED", categoryId: product.categoryId, id: { not: product.id } },
    include: { category: true, brand: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    take: 4
  });

  const related: PublicProduct[] = relatedRows.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    shortDesc: item.shortDesc,
    description: item.description,
    imageUrl: item.imageUrl,
    gallery: Array.isArray(item.gallery) ? (item.gallery as string[]) : [],
    price: item.price === null ? null : Number(item.price),
    unit: item.unit,
    productLine: item.productLine,
    aluminumSystem: item.aluminumSystem,
    color: item.color,
    thickness: item.thickness,
    stockLength: item.stockLength,
    catalogUrl: item.catalogUrl,
    videoUrl: item.videoUrl,
    specs:
      item.specs && typeof item.specs === "object" && !Array.isArray(item.specs)
        ? (item.specs as Record<string, unknown>)
        : null,
    categoryName: item.category.name,
    categorySlug: item.category.slug,
    brandName: item.brand?.name || null,
    brandSlug: item.brand?.slug || null
  }));

  const colorOptions = splitValues(product.color);
  const thicknessOptions = splitValues(product.thickness);
  const stockLengthOptions = splitValues(product.stockLength);

  const specs = [
    product.productLine ? ["Dòng sản phẩm", product.productLine] : null,
    product.aluminumSystem ? ["Hệ nhôm", product.aluminumSystem] : null,
    thicknessOptions.length ? ["Độ dày", thicknessOptions.join(" · ")] : null,
    stockLengthOptions.length ? ["Chiều dài thanh", stockLengthOptions.join(" · ")] : null,
    product.unit ? ["Đơn vị tính", product.unit] : null,
    ...(product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
      ? Object.entries(product.specs as Record<string, unknown>).map(([key, value]) => [key, displayValue(value)] as [string, string])
      : [])
  ].filter(Boolean) as [string, string][];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://congthanhco.com";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc || product.description || undefined,
    sku: product.sku || undefined,
    image: product.imageUrl || undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    category: product.category.name,
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: product.price ? Number(product.price) : undefined,
      availability: product.price
        ? "https://schema.org/InStock"
        : "https://schema.org/LimitedAvailability",
      url: `${siteUrl}/san-pham/${product.slug}`
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Sản phẩm", item: `${siteUrl}/san-pham` },
      { "@type": "ListItem", position: 3, name: product.category.name, item: `${siteUrl}/san-pham?category=${product.category.slug}` },
      { "@type": "ListItem", position: 4, name: product.name, item: `${siteUrl}/san-pham/${product.slug}` }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: siteContent.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };

  return (
    <section className="container-page py-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Link href="/san-pham" className="text-sm font-bold text-brand-700">← Quay lại sản phẩm</Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={[product.imageUrl, ...(Array.isArray(product.gallery) ? (product.gallery as string[]) : [])].filter(
            (url): url is string => Boolean(url)
          )}
          alt={product.name}
        />

        <div>
          <div className="text-sm font-bold uppercase tracking-widest text-brand-700">
            {product.brand?.name || product.category.name}
          </div>
          <h1 className="mt-3 text-2xl font-black text-slate-950 md:text-4xl">{product.name}</h1>
          {product.sku && <p className="mt-3 text-sm font-semibold text-slate-500">Mã sản phẩm: {product.sku}</p>}

          <div className="mt-6 text-2xl font-black text-brand-700">
            {product.price
              ? `Từ ${Number(product.price).toLocaleString("vi-VN")} đ${product.unit ? `/${product.unit}` : ""}`
              : "Liên hệ báo giá"}
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {product.price
              ? "Giá tham khảo, có thể thay đổi theo số lượng, màu sắc, độ dày và cấu hình thực tế."
              : "Liên hệ CÔNG THẢNH để nhận báo giá theo cấu hình cụ thể."}
          </p>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            {product.shortDesc || (!product.description ? "Liên hệ CÔNG THẢNH để được tư vấn chi tiết." : null)}
          </p>

          {colorOptions.length > 0 && (
            <div className="mt-6">
              <div className="text-xs font-bold uppercase text-slate-500">Màu sắc</div>
              <div className="mt-2 flex flex-wrap gap-3">
                {colorOptions.map((color) => {
                  const { name, hex } = parseColorEntry(color);
                  return (
                    <div key={color} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5">
                      <span className="h-4 w-4 rounded-full border border-slate-300" style={{ backgroundColor: hex }} />
                      <span className="text-sm font-semibold text-slate-700">{name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!!specs.length && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {specs.map(([key, value]) => (
                <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs font-bold uppercase text-slate-500">{key}</div>
                  <div className="mt-1 font-bold">{value}</div>
                </div>
              ))}
            </div>
          )}

          {product.warrantyPolicy && (
            <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-brand-800">
                <ShieldCheck className="h-5 w-5" /> Chính sách bảo hành
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-brand-900/80">
                {product.warrantyPolicy}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/lien-he?product=${encodeURIComponent(product.name)}`} className="btn-primary">Yêu cầu báo giá</Link>
            {product.catalogUrl && (
              <a href={product.catalogUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                <Download className="mr-2 h-4 w-4" /> Catalogue
              </a>
            )}
            {product.videoUrl && (
              <a href={product.videoUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                <PlayCircle className="mr-2 h-4 w-4" /> Video
              </a>
            )}
          </div>
        </div>
      </div>

      {product.description && (
        <div className="mt-16 max-w-4xl">
          <div className="eyebrow">Thông tin sản phẩm</div>
          <h2 className="section-title mt-3">Chi tiết {product.name}.</h2>
          <div className="mt-6 overflow-x-auto">
            <div
              className="prose-sm min-w-[560px] text-lg leading-8 text-slate-600 [&_a]:text-brand-700 [&_ul]:mt-2 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-slate-950 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-950 [&_table]:mt-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-3 [&_th]:text-left [&_th]:text-sm [&_td]:border [&_td]:border-slate-200 [&_td]:p-3 [&_td]:text-sm [&_img]:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
            />
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16">
          <div className="eyebrow">Sản phẩm liên quan</div>
          <h2 className="section-title mt-3">Xem thêm trong {product.category.name}.</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((item) => (
              <DatabaseProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-16 max-w-3xl">
        <div className="eyebrow">Câu hỏi thường gặp</div>
        <h2 className="section-title mt-3">Giải đáp nhanh trước khi đặt hàng.</h2>
        <div className="mt-6 divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
          {siteContent.faq.map((item) => (
            <details key={item.question} className="group p-5">
              <summary className="cursor-pointer list-none font-bold text-slate-950 marker:content-none">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>

      <RecentlyViewed
        current={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          imageUrl: product.imageUrl,
          price: product.price === null ? null : Number(product.price),
          unit: product.unit
        }}
      />
    </section>
  );
}
