"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getRecentlyViewed, trackRecentlyViewed, type RecentProduct } from "@/lib/recentlyViewed";

export default function RecentlyViewed({ current }: { current: RecentProduct }) {
  const [items, setItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    trackRecentlyViewed(current);
    setItems(getRecentlyViewed(current.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.id]);

  if (!items.length) return null;

  return (
    <div className="mt-16">
      <div className="eyebrow">Đã xem gần đây</div>
      <h2 className="section-title mt-3">Tiếp tục xem lại.</h2>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/san-pham/${item.slug}`}
            className="w-40 shrink-0 rounded-2xl border border-slate-100 bg-white p-3 transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
              {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
            </div>
            <div className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900">{item.name}</div>
            <div className="mt-1 text-xs text-brand-700">
              {item.price ? `Từ ${item.price.toLocaleString("vi-VN")} đ${item.unit ? `/${item.unit}` : ""}` : "Liên hệ"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
