import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={product.image} alt={product.name} fill className="object-cover transition duration-500 hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="text-xs font-bold uppercase tracking-wider text-brand-700">{product.brand}</div>
        <h3 className="mt-2 text-xl font-bold text-slate-950">{product.name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{product.short}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="price">{product.price.toLocaleString("vi-VN")} đ/{product.unit}</div>
          <Link href={`/san-pham/${product.slug}`} className="text-sm font-bold text-brand-700">Chi tiết →</Link>
        </div>
      </div>
    </article>
  );
}
