"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Globe2, ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const hotline = process.env.NEXT_PUBLIC_HOTLINE || site.hotline;

  return (
    <footer className="mt-24 bg-brand-900 text-brand-100">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_0.7fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500 text-lg font-black text-white">
              CT
            </span>
            <div>
              <div className="text-2xl font-black text-white">{site.name}</div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">
                Giải pháp nhôm hiện đại
              </div>
            </div>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-7 text-brand-200/80">
            Cung cấp nhôm thanh, phụ kiện cửa và giải pháp nội thất nhôm cho xưởng sản xuất,
            đại lý và công trình tại An Giang và khu vực miền Tây.
          </p>
          <Link
            href="/lien-he"
            className="mt-6 inline-flex items-center gap-2 font-bold text-white"
          >
            Nhận tư vấn từ CÔNG THẢNH <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          <h3 className="font-bold text-white">Khám phá</h3>
          <div className="mt-5 grid gap-3 text-sm">
            <Link href="/san-pham" className="hover:text-white">Sản phẩm</Link>
            <Link href="/bang-gia" className="hover:text-white">Bảng giá</Link>
            <Link href="/du-an" className="hover:text-white">Dự án</Link>
            <Link href="/phan-mem" className="hover:text-white">Phần mềm</Link>
            <Link href="/lien-he" className="hover:text-white">Liên hệ</Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">Thông tin liên hệ</h3>
          <div className="mt-5 grid gap-4 text-sm">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />
              <span>{site.address}</span>
            </div>
            <div className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0 text-brand-300" />
              <a href={`tel:${hotline.replace(/\s/g, "")}`} className="hover:text-white">
                {hotline}
              </a>
            </div>
            <div className="flex gap-3">
              <Globe2 className="h-5 w-5 shrink-0 text-brand-300" />
              <a href="https://congthanhco.com" className="hover:text-white">
                congthanhco.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-brand-300/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 CÔNG THẢNH. Bảo lưu mọi quyền.</span>
          <span>Website v0.9 · Nền tảng sản phẩm và báo giá</span>
        </div>
      </div>
    </footer>
  );
}
