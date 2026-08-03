"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PriceProduct = {
  id: string;
  name: string;
  sku: string | null;
  unit: string | null;
  categoryName: string;
  brandName: string | null;
  price: number | null;
  dealerPrice: number | null;
};

type DraftPrice = {
  price: string;
  dealerPrice: string;
};

function formatMoney(value: number | null) {
  return value === null ? "—" : value.toLocaleString("vi-VN");
}

export default function PriceManager({ products }: { products: PriceProduct[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [drafts, setDrafts] = useState<Record<string, DraftPrice>>({});
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return products;
    return products.filter((product) =>
      [product.name, product.sku || "", product.brandName || "", product.categoryName]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [products, query]);

  function change(id: string, field: keyof DraftPrice, value: string, product: PriceProduct) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        price: current[id]?.price ?? (product.price?.toString() || ""),
        dealerPrice: current[id]?.dealerPrice ?? (product.dealerPrice?.toString() || ""),
        [field]: value
      }
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updates = Object.entries(drafts).map(([productId, value]) => ({
      productId,
      price: value.price === "" ? null : Number(value.price),
      dealerPrice: value.dealerPrice === "" ? null : Number(value.dealerPrice)
    }));

    if (!updates.length) {
      setMessage("Chưa có giá nào được thay đổi.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/prices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates, note })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Không thể cập nhật bảng giá");
      setDrafts({});
      setNote("");
      setMessage(`Đã cập nhật ${result.updatedCount} sản phẩm.`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6">
      <div className="flex flex-col gap-3 rounded-3xl border bg-white p-5 lg:flex-row lg:items-center lg:justify-between">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 lg:max-w-xl"
          placeholder="Tìm theo tên, mã, thương hiệu hoặc danh mục..."
        />
        <a href="/api/admin/prices/export" className="btn-secondary whitespace-nowrap">
          Xuất CSV
        </a>
      </div>

      <div className="overflow-hidden rounded-3xl border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-5 py-4">Sản phẩm</th>
                <th className="px-5 py-4">Danh mục</th>
                <th className="px-5 py-4">Giá hiện tại</th>
                <th className="px-5 py-4">Giá bán mới</th>
                <th className="px-5 py-4">Giá đại lý hiện tại</th>
                <th className="px-5 py-4">Giá đại lý mới</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const draft = drafts[product.id];
                return (
                  <tr key={product.id} className="border-t align-top">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-950">{product.name}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {product.sku || "Chưa có SKU"} · {product.brandName || "Không thương hiệu"}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{product.categoryName}</td>
                    <td className="px-5 py-4 font-semibold text-brand-700">{formatMoney(product.price)}</td>
                    <td className="px-5 py-4">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={draft?.price ?? (product.price?.toString() || "")}
                        onChange={(event) => change(product.id, "price", event.target.value, product)}
                        className="w-40 rounded-xl border border-slate-200 px-3 py-2"
                        placeholder="Liên hệ"
                      />
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{formatMoney(product.dealerPrice)}</td>
                    <td className="px-5 py-4">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={draft?.dealerPrice ?? (product.dealerPrice?.toString() || "")}
                        onChange={(event) => change(product.id, "dealerPrice", event.target.value, product)}
                        className="w-40 rounded-xl border border-slate-200 px-3 py-2"
                        placeholder="Chưa nhập"
                      />
                    </td>
                  </tr>
                );
              })}
              {!filtered.length && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-500">Không tìm thấy sản phẩm.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sticky bottom-4 rounded-3xl border border-brand-100 bg-white/95 p-5 shadow-xl backdrop-blur-xl">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <label className="text-sm font-bold text-slate-700">Ghi chú lần điều chỉnh</label>
            <input
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
              placeholder="Ví dụ: Cập nhật giá tháng 8/2026"
            />
          </div>
          <button disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Đang lưu..." : `Lưu ${Object.keys(drafts).length} thay đổi`}
          </button>
        </div>
        {message && <p className="mt-3 rounded-2xl bg-brand-50 p-3 text-sm text-brand-800">{message}</p>}
      </div>
    </form>
  );
}
