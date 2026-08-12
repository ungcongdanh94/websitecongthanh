"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { site } from "@/data/site";

export default function FloatingContact() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const hotline = process.env.NEXT_PUBLIC_HOTLINE || site.hotline;
  const zaloUrl = process.env.NEXT_PUBLIC_ZALO_URL || site.zaloUrl;

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col gap-3">
      {zaloUrl && (
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn Zalo"
          className="grid h-12 w-12 place-items-center rounded-full bg-white text-blue-600 shadow-xl ring-1 ring-slate-200 transition hover:scale-105"
        >
          <span className="text-xs font-black">Zalo</span>
        </a>
      )}
      <a
        href={`tel:${hotline.replace(/\s/g, "")}`}
        aria-label="Gọi tư vấn"
        className="grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-white shadow-xl transition hover:bg-brand-700 hover:scale-105"
      >
        <Phone className="h-5 w-5" />
      </a>
    </div>
  );
}
