"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  ["Sản phẩm", "/san-pham"],
  ["Bảng giá", "/bang-gia"],
  ["So sánh", "/so-sanh"],
  ["Dự án", "/du-an"],
  ["Phần mềm", "/phan-mem"],
  ["Liên hệ", "/lien-he"]
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  const hotline = process.env.NEXT_PUBLIC_HOTLINE || "0900000000";

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-2xl">
      <div className="container-page flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-800 text-lg font-black text-white shadow-soft">
            CT
          </span>
          <span>
            <span className="block text-xl font-black tracking-tight text-slate-950">
              CÔNG THẢNH
            </span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:block">
              Nhôm · Phụ kiện · Nội thất
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {nav.map(([label, href]) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-brand-50 text-brand-800"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link href="/lien-he" className="btn-secondary py-2.5">
            Nhận báo giá
          </Link>
          <a href={`tel:${hotline}`} className="btn-primary py-2.5">
            <Phone className="mr-2 h-4 w-4" />
            Hotline
          </a>
        </div>

        <button
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-800 xl:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white xl:hidden">
          <div className="container-page grid gap-1 py-4">
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-800"
              >
                {label}
              </Link>
            ))}
            <a
              href={`tel:${hotline}`}
              className="btn-primary mt-2"
              onClick={() => setOpen(false)}
            >
              <Phone className="mr-2 h-4 w-4" />
              Gọi tư vấn
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
