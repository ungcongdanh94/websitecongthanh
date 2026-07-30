"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="container-page flex h-18 items-center justify-between py-4">
        <Link href="/" className="text-2xl font-black tracking-tight text-brand-800">CÔNG THẢNH</Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-semibold text-slate-700 hover:text-brand-700">{label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a href="tel:0900000000" className="btn-primary"><Phone className="mr-2 h-4 w-4" /> Hotline</a>
        </div>
        <button aria-label="Mở menu" onClick={() => setOpen(!open)} className="rounded-xl border p-2 lg:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="container-page grid gap-2 border-t py-4 lg:hidden">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 font-semibold hover:bg-brand-50">{label}</Link>
          ))}
        </div>
      )}
    </header>
  );
}
