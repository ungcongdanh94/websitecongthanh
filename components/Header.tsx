"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Phone, Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Suggestion = { id: string; name: string; slug: string; imageUrl: string | null; price: number | null; unit: string | null };

const nav = [
  ["Giới thiệu", "/gioi-thieu"],
  ["Sản phẩm", "/san-pham"],
  ["Thương hiệu", "/thuong-hieu"],
  ["Bảng giá", "/bang-gia"],
  ["So sánh", "/so-sanh"],
  ["Dự án", "/du-an"],
  ["Phần mềm", "/phan-mem"],
  ["Liên hệ", "/lien-he"]
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetch(`/api/search/suggest?q=${encodeURIComponent(query.trim())}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data.results || []))
        .catch(() => setSuggestions([]));
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  if (pathname.startsWith("/admin")) return null;

  const hotline = process.env.NEXT_PUBLIC_HOTLINE || "0908 22 99 77";

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setShowSuggestions(false);
    const q = query.trim();
    router.push(q ? `/san-pham?q=${encodeURIComponent(q)}` : "/san-pham");
  }

  function goToProduct(slug: string) {
    setShowSuggestions(false);
    setQuery("");
    router.push(`/san-pham/${slug}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/95 backdrop-blur-xl">
      <div className="hidden bg-brand-900 text-brand-50 lg:block">
        <div className="container-page flex items-center justify-between py-2 text-xs">
          <span>595A Trần Hưng Đạo, P. Bình Đức, An Giang · Giao hàng toàn quốc</span>
          <span>Bảo hành theo chính sách từng sản phẩm · Hỗ trợ kỹ thuật tận tâm</span>
        </div>
      </div>

      <div className="container-page flex min-h-20 items-center gap-4 py-3">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="relative h-11 w-11 shrink-0">
            <Image
              src="/assets/logos/logo-cong-thanh-color.png"
              alt="CÔNG THẢNH"
              fill
              className="object-contain"
              priority
            />
          </span>
          <span className="hidden sm:block">
            <span className="block text-xl font-black tracking-tight text-slate-950">
              CÔNG THẢNH
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Nhôm · Phụ kiện · Nội thất
            </span>
          </span>
        </Link>

        <div className="relative hidden flex-1 md:block">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2"
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              type="text"
              placeholder="Tìm sản phẩm, danh mục — ví dụ: Xingfa hệ 65..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={() => goToProduct(item.slug)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"
                >
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-slate-900">{item.name}</span>
                    <span className="block text-xs text-slate-500">
                      {item.price ? `Từ ${item.price.toLocaleString("vi-VN")} đ${item.unit ? `/${item.unit}` : ""}` : "Liên hệ"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <a
          href={`tel:${hotline.replace(/\s/g, "")}`}
          className="hidden shrink-0 items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5 xl:flex"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700">
            <Phone className="h-4 w-4" />
          </span>
          <span className="leading-tight">
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Hotline 24/7
            </span>
            <span className="block text-sm font-black text-slate-950">{hotline}</span>
          </span>
        </a>

        <Link href="/lien-he" className="btn-primary hidden shrink-0 py-2.5 lg:inline-flex">
          Nhận báo giá
        </Link>

        <button
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-800 xl:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <nav className="hidden border-t border-slate-100 xl:block">
        <div className="container-page flex items-center gap-1 py-2">
          {nav.map(([label, href]) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-brand-50 text-brand-800"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white xl:hidden">
          <div className="container-page grid gap-1 py-4">
            <form onSubmit={handleSearch} className="mb-2 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                placeholder="Tìm sản phẩm, danh mục..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button type="submit" aria-label="Tìm kiếm" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                <Search className="h-4 w-4" />
              </button>
            </form>
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
              href={`tel:${hotline.replace(/\s/g, "")}`}
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
