import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import { Download, PlayCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductGallery from "@/components/ProductGallery";

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
    product.shortDesc ||
    product.description?.slice(0, 160) ||
    `${product.name} — ${product.category.name} chính hãng tại CÔNG THẢNH.`;

  return {
    title: `${product.name} | CÔNG THẢNH`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined
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

  const specs = [
    product.productLine ? ["Dòng sản phẩm", product.productLine] : null,
    product.aluminumSystem ? ["Hệ nhôm", product.aluminumSystem] : null,
    product.color ? ["Màu sắc", product.color] : null,
    product.thickness !== null ? ["Độ dày", `${Number(product.thickness)} mm`] : null,
    product.stockLength ? ["Chiều dài thanh", `${product.stockLength.toLocaleString("vi-VN")} mm`] : null,
    product.unit ? ["Đơn vị tính", product.unit] : null,
    ...(product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
      ? Object.entries(product.specs as Record<string, unknown>).map(([key, value]) => [key, displayValue(value)] as [string, string])
      : [])
  ].filter(Boolean) as [string, string][];

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
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://congthanhco.com"}/san-pham/${product.slug}`
    }
  };

  return (
    <section className="container-page py-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
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
          <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-6xl">{product.name}</h1>
          {product.sku && <p className="mt-3 text-sm font-semibold text-slate-500">Mã sản phẩm: {product.sku}</p>}

          <div className="mt-6 text-3xl font-black text-brand-700">
            {product.price
              ? `${Number(product.price).toLocaleString("vi-VN")} đ${product.unit ? `/${product.unit}` : ""}`
              : "Liên hệ báo giá"}
          </div>
          <p className="mt-2 text-sm text-slate-500">Giá có thể thay đổi theo số lượng, màu sắc và cấu hình.</p>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            {product.description || product.shortDesc || "Liên hệ CÔNG THẢNH để được tư vấn chi tiết."}
          </p>

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
    </section>
  );
}
