import Image from "next/image";
import Link from "next/link";
import type { PublicProduct } from "@/types/product";
import { splitValues, parseColorEntry } from "@/lib/productDisplay";
import { optimizeImageUrl } from "@/lib/cloudinaryUrl";

function formatPrice(price: number | null, unit: string | null) {
  if (price === null) return "Liên hệ";
  return `Từ ${price.toLocaleString("vi-VN")} đ${unit ? `/${unit}` : ""}`;
}

export default function DatabaseProductCard({ product }: { product: PublicProduct }) {
  const colors = splitValues(product.color);
  const thicknesses = splitValues(product.thickness);

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-50 to-slate-100">
        {product.imageUrl ? (
          <Image
            src={optimizeImageUrl(product.imageUrl, 600)}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain transition duration-500 hover:scale-105"
          />
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
          {colors.map((color) => {
            const { name, hex } = parseColorEntry(color);
            return (
              <span key={color} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                <span className="h-3 w-3 rounded-full border border-slate-300" style={{ backgroundColor: hex }} />
                {name}
              </span>
            );
          })}
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
