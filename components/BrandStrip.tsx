"use client";

import Image from "next/image";

type Brand = { name: string; logoUrl: string | null };

export default function BrandStrip({ brands }: { brands: Brand[] }) {
  if (!brands.length) return null;

  // Nhân đôi danh sách để tạo hiệu ứng chạy liên tục không bị giật/đứt đoạn.
  const loop = [...brands, ...brands];

  return (
    <div className="group mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div className="flex w-max animate-[brand-marquee_28s_linear_infinite] gap-4 group-hover:[animation-play-state:paused]">
        {loop.map((brand, index) => (
          <div
            key={`${brand.name}-${index}`}
            className="grid h-[76px] w-[170px] shrink-0 place-items-center rounded-lg border bg-white px-4 shadow-sm"
          >
            {brand.logoUrl ? (
              <div className="relative h-full w-full py-3">
                <Image src={brand.logoUrl} alt={brand.name} fill sizes="170px" className="object-contain" />
              </div>
            ) : (
              <span className="text-center text-lg font-black leading-tight text-[#17694e]">{brand.name}</span>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes brand-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
