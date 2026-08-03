import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, PlayCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function displayValue(value: unknown) {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Có" : "Không";
  return JSON.stringify(value);
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true, brand: true }
  });

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

  return (
    <section className="container-page py-16">
      <Link href="/san-pham" className="text-sm font-bold text-brand-700">← Quay lại sản phẩm</Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-50 to-slate-100">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-3xl font-black text-brand-800">CÔNG THẢNH</div>
          )}
        </div>

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
