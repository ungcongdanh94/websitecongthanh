"use client";

import { useMemo, useState } from "react";
import { categories, products } from "@/data/products";
import ProductCard from "./ProductCard";

export default function ProductExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = category === "Tất cả" || p.category === category;
      const q = query.toLowerCase();
      const matchQuery = p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [query, category]);

  return (
    <>
      <div className="glass mb-8 grid gap-4 rounded-3xl p-4 md:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm sản phẩm hoặc thương hiệu..."
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-500"
        />
        <div className="flex flex-wrap gap-2">
          {["Tất cả", ...categories].map((item) => (
            <button key={item} onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${category === item ? "bg-brand-700 text-white" : "bg-white text-slate-700"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => <ProductCard key={product.slug} product={product} />)}
      </div>
    </>
  );
}
