"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselBrand = {
  id: string;
  name: string;
  logoUrl: string | null;
};

export default function BrandsCarousel({ brands }: { brands: CarouselBrand[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.min(el.clientWidth * 0.8, 480), behavior: "smooth" });
  }

  return (
    <div className="relative mt-8">
      <button
        type="button"
        aria-label="Xem thương hiệu trước"
        onClick={() => scroll(-1)}
        className="absolute -left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-800 shadow-soft transition hover:bg-brand-50 sm:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex h-24 w-48 shrink-0 snap-start items-center justify-center rounded-2xl border border-slate-100 bg-white px-6 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
          >
            {brand.logoUrl ? (
              <div className="relative h-12 w-full">
                <Image src={brand.logoUrl} alt={brand.name} fill className="object-contain" />
              </div>
            ) : (
              <span className="text-center text-lg font-black uppercase tracking-wide text-slate-700">
                {brand.name}
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Xem thương hiệu tiếp theo"
        onClick={() => scroll(1)}
        className="absolute -right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-800 shadow-soft transition hover:bg-brand-50 sm:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
