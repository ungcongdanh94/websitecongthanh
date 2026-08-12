"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PreviewRow = {
  rowNumber: number;
  valid: boolean;
  errors: string[];
  data: {
    sku: string | null;
    name: string;
    slug: string;
    categorySlug: string | null;
    brandSlug: string | null;
    aluminumSystem: string | null;
    color: string | null;
    thickness: string | null;
    stockLength: string | null;
    unit: string | null;
    price: number | null;
    dealerPrice: number | null;
    shortDesc: string | null;
    status: "PUBLISHED" | "DRAFT";
  };
};

export default function ProductImportManager() {
  const router = useRouter();
  const [rows, setRows] = useState<PreviewRow[] | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<{ created: number; updated: number; skippedCount: number } | null>(null);
  const [error, setError] = useState("");

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoadingPreview(true);
    setError("");
    setResult(null);
    setRows(null);

    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/products/import", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Không thể đọc file");
      setRows(data.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoadingPreview(false);
      event.target.value = "";
    }
  }

  async function confirmImport() {
    if (!rows) return;
    setConfirming(true);
    setError("");

    try {
      const response = await fetch("/api/admin/products/import/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: rows.filter((r) => r.valid).map((r) => r.data) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Không thể nhập dữ liệu");
      setResult({ created: data.created, updated: data.updated, skippedCount: data.skippedCount });
      setRows(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setConfirming(false);
    }
  }

  const validCount = rows?.filter((r) => r.valid).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-white p-6">
        <p className="text-sm text-slate-600">
          File Excel/CSV cần các cột: <code>SKU</code>, <code>Tên sản phẩm</code>, <code>Slug</code> (tùy chọn),{" "}
          <code>Danh mục</code> (bắt buộc — tên hoặc slug danh mục đã có sẵn), <code>Thương hiệu</code>,{" "}
          <code>Hệ nhôm</code>, <code>Màu</code>, <code>Độ dày</code>, <code>Chiều dài thanh</code>,{" "}
          <code>Đơn vị</code>, <code>Giá bán</code>, <code>Giá đại lý</code>, <code>Mô tả ngắn</code>,{" "}
          <code>Trạng thái</code> ("Công khai" hoặc để trống = Bản nháp).
        </p>
        <label className="btn-primary mt-4 inline-flex cursor-pointer">
          {loadingPreview ? "Đang đọc file..." : "Chọn file để xem trước"}
          <input type="file" accept=".xlsx,.xls,.csv" className="hidden" disabled={loadingPreview} onChange={handleFile} />
        </label>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>
      )}

      {result && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm font-bold text-brand-800">
          Đã nhập xong: {result.created} sản phẩm mới, {result.updated} sản phẩm được cập nhật.
          {result.skippedCount > 0 && ` Bỏ qua ${result.skippedCount} dòng không hợp lệ.`}
        </div>
      )}

      {rows && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-bold text-slate-700">
              Xem trước: {rows.length} dòng — <span className="text-brand-700">{validCount} hợp lệ</span>,{" "}
              <span className="text-red-600">{rows.length - validCount} lỗi</span>
            </div>
            <button onClick={confirmImport} disabled={confirming || !validCount} className="btn-primary disabled:opacity-50">
              {confirming ? "Đang nhập..." : `Xác nhận nhập ${validCount} sản phẩm hợp lệ`}
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl border bg-white">
            <div className="max-h-[500px] overflow-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="sticky top-0 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3">Dòng</th>
                    <th className="px-4 py-3">Tên sản phẩm</th>
                    <th className="px-4 py-3">Danh mục</th>
                    <th className="px-4 py-3">Giá</th>
                    <th className="px-4 py-3">Trạng thái xem trước</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.rowNumber} className={`border-t ${row.valid ? "" : "bg-red-50"}`}>
                      <td className="px-4 py-3 text-slate-500">{row.rowNumber}</td>
                      <td className="px-4 py-3 font-semibold">{row.data.name || "—"}</td>
                      <td className="px-4 py-3">{row.data.categorySlug || "—"}</td>
                      <td className="px-4 py-3">{row.data.price ? row.data.price.toLocaleString("vi-VN") : "Liên hệ"}</td>
                      <td className="px-4 py-3">
                        {row.valid ? (
                          <span className="font-bold text-brand-700">Hợp lệ</span>
                        ) : (
                          <span className="font-bold text-red-600">{row.errors.join(", ")}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
