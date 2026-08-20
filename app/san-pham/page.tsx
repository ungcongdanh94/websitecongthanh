"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

type Option = { value: string; label: string };

export default function ProductFilterPanel({
  q,
  category,
  brand,
  system,
  color,
  thickness,
  minPrice,
  maxPrice,
  sort,
  categories,
  brands,
  systems,
  sortOptions,
  hasActiveFilters
}: {
  q: string;
  category: string;
  brand: string;
  system: string;
  color: string;
  thickness: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
  categories: Option[];
  brands: Option[];
  systems: string[];
  sortOptions: readonly Option[];
  hasActiveFilters: boolean;
}) {
  const [open, setOpen] = useState(hasActiveFilters);
  const field = "rounded-2xl border border-slate-200 bg-white px-4 py-3";

  return (
    <form className="mt-8 rounded-3xl border border-slate-200 bg-white p-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
        <input name="q" defaultValue={q} className={field} placeholder="Tên, mã hoặc hệ nhôm..." />
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
            hasActiveFilters ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-600 hover:border-brand-300"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Bộ lọc{hasActiveFilters ? " (đang áp dụng)" : ""}
        </button>
        <button className="btn-primary">Lọc sản phẩm</button>
      </div>

      {open && (
        <div className="mt-3 grid gap-3 border-t border-slate-100 pt-4 md:grid-cols-2 xl:grid-cols-4">
          <select name="category" defaultValue={category} className={field}>
            <option value="">Tất cả danh mục</option>
            {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <select name="brand" defaultValue={brand} className={field}>
            <option value="">Tất cả thương hiệu</option>
            {brands.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <select name="system" defaultValue={system} className={field}>
            <option value="">Tất cả hệ nhôm</option>
            {systems.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select name="sort" defaultValue={sort} className={field}>
            {sortOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <input name="color" defaultValue={color} className={field} placeholder="Màu (VD: Trắng, Ghi xám)" />
          <input name="thickness" defaultValue={thickness} className={field} placeholder="Độ dày (VD: 1.4mm)" />
          <input name="minPrice" type="number" min="0" step="1000" defaultValue={minPrice} className={field} placeholder="Giá từ (đ)" />
          <input name="maxPrice" type="number" min="0" step="1000" defaultValue={maxPrice} className={field} placeholder="Giá đến (đ)" />
        </div>
      )}

      {!open && (
        <input type="hidden" name="sort" value={sort} />
      )}
    </form>
  );
}
