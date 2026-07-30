"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["Tổng quan", "/admin"],
  ["Sản phẩm", "/admin/products"],
  ["Danh mục", "/admin/categories"],
  ["Thương hiệu", "/admin/brands"],
  ["Dự án", "/admin/projects"],
  ["Banner", "/admin/banners"],
  ["Báo giá", "/admin/quotes"]
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 lg:flex">
      {items.map(([label, href]) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
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
  );
}
