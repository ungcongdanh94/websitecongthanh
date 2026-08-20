"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BrandStrip({ brands }: { brands: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    trackRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="relative mt-6">
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {brands.map((name) => (
          <div
            key={name}
            className="grid min-h-[76px] w-[160px] shrink-0 place-items-center rounded-lg border bg-white px-4 text-lg font-black text-[#17694e] shadow-sm"
          >
            {name}
          </div>
        ))}
      </div>

      {brands.length > 4 && (
        <>
          <button
            type="button"
            onClick={() => scrollBy(-340)}
            aria-label="Xem thương hiệu trước"
            className="absolute -left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border bg-white shadow-md sm:grid"
          >
            <ChevronLeft className="h-5 w-5 text-[#17694e]" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(340)}
            aria-label="Xem thương hiệu tiếp theo"
            className="absolute -right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border bg-white shadow-md sm:grid"
          >
            <ChevronRight className="h-5 w-5 text-[#17694e]" />
          </button>
        </>
      )}
    </div>
  );
}
