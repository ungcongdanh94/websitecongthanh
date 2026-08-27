"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mail, Clock3, FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { site } from "@/data/site";
import { productMenu } from "@/data/product-menu";

const nav: [string, string][] = [
  ["Trang chủ", "/"],
  ["Giới thiệu", "/gioi-thieu"],
  ["Dự án", "/du-an"],
  ["Phần mềm", "/phan-mem"],
  ["Tin tức", "/tin-tuc"],
  ["Liên hệ", "/lien-he"]
];

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false); // menu mobile tổng
  const [productsOpen, setProductsOpen] = useState(false); // dropdown "Sản phẩm" desktop
  const [activeGroup, setActiveGroup] = useState<number | null>(null); // nhóm đang hover để hiện flyout
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileGroupOpen, setMobileGroupOpen] = useState<number | null>(null);

  if (path.startsWith("/admin")) return null;
  const hotline = process.env.NEXT_PUBLIC_HOTLINE || "0908 22 99 77";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-[#003f32] text-white">
        <div className="container-page flex h-8 items-center justify-between text-[10px] sm:text-xs">
          <div className="flex gap-5">
            <a href={`tel:${hotline.replace(/\s/g, "")}`} className="flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-lime-400" />
              Hotline: {hotline}
            </a>
            <a href={`mailto:${site.email}`} className="hidden items-center gap-1.5 sm:flex">
              <Mail className="h-3 w-3 text-lime-400" />
              {site.email}
            </a>
          </div>
          <span className="hidden items-center gap-1.5 md:flex">
            <Clock3 className="h-3 w-3 text-lime-400" />
            Giờ làm việc: 7:30 - 17:00 (T2 - T7)
          </span>
        </div>
      </div>

      <div className="container-page flex h-[76px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-12 w-12">
            <Image src="/assets/logos/logo-cong-thanh-color.png" alt="CÔNG THẢNH" fill className="object-contain" priority />
          </span>
          <span>
            <b className="block text-lg font-black">CÔNG THẢNH</b>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Nhôm - Phụ Kiện - Nội Thất Cao Cấp
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className={`border-b-2 px-3 py-3 text-xs font-extrabold uppercase ${
              path === "/" ? "border-brand-600 text-brand-700" : "border-transparent hover:text-brand-700"
            }`}
          >
            Trang chủ
          </Link>

          {/* Dropdown nhiều cấp: Sản phẩm */}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => {
              setProductsOpen(false);
              setActiveGroup(null);
            }}
          >
            <Link
              href="/san-pham"
              className={`flex items-center gap-1 border-b-2 px-3 py-3 text-xs font-extrabold uppercase ${
                path.startsWith("/san-pham") ? "border-brand-600 text-brand-700" : "border-transparent hover:text-brand-700"
              }`}
            >
              Sản phẩm
              <ChevronDown className="h-3 w-3" />
            </Link>

            {productsOpen && (
              <div className="absolute left-0 top-full flex rounded-b-xl border border-slate-200 bg-white shadow-soft">
                {/* Cấp 2: 5 nhóm lớn */}
                <ul className="w-64 divide-y divide-slate-100 py-2">
                  {productMenu.map((group, index) => {
                    const hasChildren = Boolean(group.children?.length);
                    const rowClass = `flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm font-bold ${
                      activeGroup === index ? "bg-brand-700 text-white" : "text-slate-800 hover:bg-brand-50"
                    }`;
                    return (
                      <li key={group.name} onMouseEnter={() => setActiveGroup(index)}>
                        {hasChildren ? (
                          <div className={rowClass}>
                            {group.name}
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        ) : (
                          <Link
                            href={`/san-pham?category=${group.slug}`}
                            className={rowClass}
                            onClick={() => setProductsOpen(false)}
                          >
                            {group.name}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* Cấp 3: flyout hệ sản phẩm con của nhóm đang active */}
                {activeGroup !== null && productMenu[activeGroup].children && (
                  <ul className="w-72 divide-y divide-slate-100 border-l border-slate-100 py-2">
                    {productMenu[activeGroup].children!.map((leaf) => (
                      <li key={leaf.slug}>
                        <Link
                          href={`/san-pham?category=${leaf.slug}`}
                          className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                          onClick={() => setProductsOpen(false)}
                        >
                          {leaf.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {nav.slice(1).map(([l, h]) => (
            <Link
              key={h + l}
              href={h}
              className={`border-b-2 px-3 py-3 text-xs font-extrabold uppercase ${
                path === h ? "border-brand-600 text-brand-700" : "border-transparent hover:text-brand-700"
              }`}
            >
              {l}
            </Link>
          ))}
        </nav>

        <Link
          href="/lien-he"
          className="hidden items-center gap-2 rounded-md bg-brand-700 px-4 py-3 text-xs font-black uppercase text-white lg:flex"
        >
          <FileText className="h-4 w-4" />
          Báo giá ngay
        </Link>

        <button onClick={() => setOpen(!open)} className="rounded-md border p-2 lg:hidden" aria-label="Mở menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="border-t bg-white lg:hidden">
          <div className="container-page flex flex-col py-3">
            <Link onClick={() => setOpen(false)} href="/" className="border-b px-2 py-3 text-sm font-bold">
              Trang chủ
            </Link>

            {/* Sản phẩm - accordion nhiều cấp */}
            <div className="border-b">
              <button
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className="flex w-full items-center justify-between px-2 py-3 text-sm font-bold"
              >
                Sản phẩm
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileProductsOpen && (
                <div className="pb-2 pl-3">
                  {productMenu.map((group, index) => {
                    const hasChildren = Boolean(group.children?.length);
                    if (!hasChildren) {
                      return (
                        <Link
                          key={group.name}
                          href={`/san-pham?category=${group.slug}`}
                          onClick={() => setOpen(false)}
                          className="block py-2 text-sm font-semibold text-slate-700"
                        >
                          {group.name}
                        </Link>
                      );
                    }
                    const isGroupOpen = mobileGroupOpen === index;
                    return (
                      <div key={group.name}>
                        <button
                          onClick={() => setMobileGroupOpen(isGroupOpen ? null : index)}
                          className="flex w-full items-center justify-between py-2 text-sm font-semibold text-slate-700"
                        >
                          {group.name}
                          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isGroupOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isGroupOpen && (
                          <div className="pb-1 pl-3">
                            {group.children!.map((leaf) => (
                              <Link
                                key={leaf.slug}
                                href={`/san-pham?category=${leaf.slug}`}
                                onClick={() => setOpen(false)}
                                className="block py-1.5 text-xs font-semibold text-slate-500"
                              >
                                {leaf.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {nav.slice(1).map(([l, h]) => (
              <Link onClick={() => setOpen(false)} key={h + l} href={h} className="border-b px-2 py-3 text-sm font-bold">
                {l}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
