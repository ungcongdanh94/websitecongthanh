"use client";

import Image from "next/image";
import { useState } from "react";
import { optimizeImageUrl } from "@/lib/cloudinaryUrl";

export default function ProductGallery({
  images,
  alt
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const gallery = images.length ? images : [];
  const current = gallery[active];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-50 to-slate-100">
        {current ? (
          <Image
            src={optimizeImageUrl(current, 900)}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl font-black text-brand-800">CÔNG THẢNH</div>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {gallery.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-20 w-20 overflow-hidden rounded-2xl bg-slate-100 transition ${
                index === active ? "ring-4 ring-brand-500" : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Xem ảnh ${index + 1}`}
            >
              <Image src={optimizeImageUrl(url, 300)} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
