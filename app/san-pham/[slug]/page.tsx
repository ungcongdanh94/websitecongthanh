import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <section className="container-page py-16">
      <Link href="/san-pham" className="text-sm font-bold text-brand-700">← Quay lại sản phẩm</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[2.5rem]">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-widest text-brand-700">{product.brand}</div>
          <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-6xl">{product.name}</h1>
          <div className="mt-6 text-3xl font-black text-brand-700">{product.price.toLocaleString("vi-VN")} đ/{product.unit}</div>
          <p className="mt-2 text-sm text-slate-500">Giá tham khảo, có thể thay đổi theo số lượng và cấu hình.</p>
          <p className="mt-6 text-lg leading-8 text-slate-600">{product.description}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold uppercase text-slate-500">{key}</div>
                <div className="mt-1 font-bold">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/lien-he" className="btn-primary">Yêu cầu báo giá</Link>
            <Link href="/so-sanh" className="btn-secondary">So sánh sản phẩm</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
