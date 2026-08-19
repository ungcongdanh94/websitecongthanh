"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import DuplicateProductButton from "@/components/admin/DuplicateProductButton";

type Row = {
  id: string;
  name: string;
  sku: string | null;
  categoryName: string;
  aluminumSystem: string | null;
  productLine: string | null;
  brandName: string | null;
  thickness: string | null;
  stockLength: string | null;
  price: number | null;
  dealerPrice: number | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

const statusLabel: Record<Row["status"], string> = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Công khai",
  ARCHIVED: "Lưu trữ"
};

export default function ProductTable({ products }: { products: Row[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const allSelected = products.length > 0 && selected.size === products.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(products.map((p) => p.id)));
  }

  function toggleOne(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulkSetStatus(status: Row["status"]) {
    if (!selected.size) return;
    setLoading(true);
    const response = await fetch("/api/admin/products/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected), status })
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      alert(result.message || "Không thể cập nhật");
      return;
    }

    setSelected(new Set());
    router.refresh();
  }

  return (
    <div>
      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-3">
          <span className="text-sm font-bold text-brand-800">Đã chọn {selected.size} sản phẩm</span>
          <button disabled={loading} onClick={() => bulkSetStatus("PUBLISHED")} className="btn-secondary py-2 text-xs">Công khai</button>
          <button disabled={loading} onClick={() => bulkSetStatus("DRAFT")} className="btn-secondary py-2 text-xs">Chuyển về nháp</button>
          <button disabled={loading} onClick={() => bulkSetStatus("ARCHIVED")} className="btn-secondary py-2 text-xs">Lưu trữ</button>
          <button onClick={() => setSelected(new Set())} className="text-xs font-semibold text-slate-500">Bỏ chọn</button>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-10 px-5 py-4">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 accent-brand-600" />
                </th>
                <th className="px-5 py-4">Tên</th>
                <th className="px-5 py-4">Hệ / dòng</th>
                <th className="px-5 py-4">Thương hiệu</th>
                <th className="px-5 py-4">Quy cách</th>
                <th className="px-5 py-4">Giá bán</th>
                <th className="px-5 py-4">Giá đại lý</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t align-top">
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(product.id)}
                      onChange={() => toggleOne(product.id)}
                      className="h-4 w-4 accent-brand-600"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold">{product.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{product.sku || product.categoryName}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div>{product.aluminumSystem || "—"}</div>
                    <div className="mt-1 text-xs text-slate-500">{product.productLine || "—"}</div>
                  </td>
                  <td className="px-5 py-4">{product.brandName || "—"}</td>
                  <td className="px-5 py-4">
                    <div>{product.thickness || "—"}</div>
                    <div className="mt-1 text-xs text-slate-500">{product.stockLength || "—"}</div>
                  </td>
                  <td className="px-5 py-4">{product.price ? product.price.toLocaleString("vi-VN") : "Liên hệ"}</td>
                  <td className="px-5 py-4 text-slate-600">{product.dealerPrice ? product.dealerPrice.toLocaleString("vi-VN") : "—"}</td>
                  <td className="px-5 py-4">{statusLabel[product.status]}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${product.id}`} className="font-semibold text-brand-700">Sửa</Link>
                      <DuplicateProductButton productId={product.id} />
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
              {!products.length && (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-slate-500">Không tìm thấy sản phẩm.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
