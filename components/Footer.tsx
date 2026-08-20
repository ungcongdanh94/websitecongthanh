"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MapPin, Phone, Globe2, ArrowUpRight, Facebook, MessageCircle, Clock3 } from "lucide-react";
import { site } from "@/data/site";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const hotline = process.env.NEXT_PUBLIC_HOTLINE || site.hotline;
  const zaloUrl = process.env.NEXT_PUBLIC_ZALO_URL || site.zaloUrl;
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL;

  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <span className="relative h-12 w-12 shrink-0">
              <Image
                src="/assets/logos/logo-cong-thanh-white.png"
                alt={site.name}
                fill
                className="object-contain"
              />
            </span>
            <div>
              <div className="text-2xl font-black text-white">{site.name}</div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">
                Giải pháp nhôm hiện đại
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm leading-7 text-brand-200/80">
            Cung cấp nhôm thanh, phụ kiện cửa và giải pháp nội thất nhôm cho xưởng sản xuất,
            đại lý và công trình tại An Giang và khu vực miền Tây.
          </p>
          <Link
            href="/lien-he"
            className="mt-6 inline-flex items-center gap-2 font-bold text-white"
          >
            Nhận tư vấn từ CÔNG THẢNH <ArrowUpRight className="h-4 w-4" />
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={`tel:${hotline.replace(/\s/g, "")}`}
              aria-label="Gọi hotline"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <Phone className="h-4 w-4" />
            </a>
            {zaloUrl && (
              <a
                href={zaloUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Nhắn Zalo"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Fanpage Facebook"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-bold text-white">Liên kết nhanh</h3>
          <div className="mt-5 grid gap-3 text-sm">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <Link href="/gioi-thieu" className="hover:text-white">Giới thiệu</Link>
            <Link href="/du-an" className="hover:text-white">Dự án</Link>
            <Link href="/phan-mem" className="hover:text-white">Phần mềm</Link>
            <Link href="/lien-he" className="hover:text-white">Liên hệ</Link>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-bold text-white">Sản phẩm</h3>
          <div className="mt-5 grid gap-3 text-sm">
            <Link href="/san-pham" className="hover:text-white">Tất cả sản phẩm</Link>
            <Link href="/thuong-hieu" className="hover:text-white">Thương hiệu</Link>
            <Link href="/so-sanh" className="hover:text-white">So sánh sản phẩm</Link>
            <Link href="/phan-mem" className="hover:text-white">Phần mềm</Link>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-bold text-white">Hỗ trợ</h3>
          <div className="mt-5 grid gap-4 text-sm">
            <div className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0 text-brand-300" />
              <a href={`tel:${hotline.replace(/\s/g, "")}`} className="hover:text-white">
                Hotline: {hotline}
              </a>
            </div>
            {zaloUrl && (
              <a href={zaloUrl} target="_blank" rel="noreferrer" className="flex gap-3 hover:text-white">
                <MessageCircle className="h-5 w-5 shrink-0 text-brand-300" />
                Nhắn Zalo tư vấn
              </a>
            )}
            <div className="flex gap-3">
              <Clock3 className="h-5 w-5 shrink-0 text-brand-300" />
              Tiếp nhận yêu cầu trong giờ làm việc
            </div>
            <div className="flex gap-3">
              <Globe2 className="h-5 w-5 shrink-0 text-brand-300" />
              <a href="https://congthanhco.com" className="hover:text-white">
                congthanhco.com
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-bold text-white">Thông tin liên hệ</h3>
          <div className="mt-5 grid gap-4 text-sm">
            {site.locations.map((loc) => (
              <div key={loc.label} className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-brand-300">{loc.label}</div>
                  <div className="mt-0.5">{loc.address}</div>
                  <a href={`tel:${loc.phone.replace(/\s/g, "")}`} className="mt-0.5 block hover:text-white">
                    {loc.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-brand-300/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {site.legalName}. Bảo lưu mọi quyền.</span>
          {zaloUrl && (
            <a href={zaloUrl} target="_blank" rel="noreferrer" className="hover:text-white">
              Nhắn Zalo: {hotline}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
