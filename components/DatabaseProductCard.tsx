import Image from "next/image";
import Link from "next/link";
import type { PublicProduct } from "@/types/product";
import { splitValues } from "@/lib/productDisplay";

function formatPrice(price: number | null, unit: string | null) {
  if (price === null) return "Liên hệ";
  return `Từ ${price.toLocaleString("vi-VN")} đ${unit ? `/${unit}` : ""}`;
}

export default function DatabaseProductCard({ product }: { product: PublicProduct }) {
  const colors = splitValues(product.color);
  const thicknesses = splitValues(product.thickness);

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-50 to-slate-100">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition duration-500 hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-lg font-bold text-brand-800">CÔNG THẢNH</div>
        )}
      </div>
      <div className="p-5">
        <div className="text-xs font-bold uppercase tracking-wider text-brand-700">
          {product.brandName || product.categoryName}
        </div>
        <h2 className="mt-2 text-xl font-bold text-slate-950">{product.name}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.aluminumSystem && <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">{product.aluminumSystem}</span>}
          {colors.map((color) => (
            <span key={color} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{color}</span>
          ))}
          {thicknesses.map((thickness) => (
            <span key={thickness} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{thickness}</span>
          ))}
        </div>
        <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
          {product.shortDesc || "Liên hệ CÔNG THẢNH để được tư vấn thông số và cấu hình phù hợp."}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="price">{formatPrice(product.price, product.unit)}</div>
          <Link href={`/san-pham/${product.slug}`} className="text-sm font-bold text-brand-700">Chi tiết →</Link>
        </div>
      </div>
    </article>
  );
}
