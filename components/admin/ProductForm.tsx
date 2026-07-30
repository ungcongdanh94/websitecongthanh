"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Option = { id: string; name: string };

export default function ProductForm({
  categories,
  brands
}: {
  categories: Option[];
  brands: Option[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Không thể tạo sản phẩm");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-3xl border bg-white p-6">
      <input name="name" required className="rounded-2xl border px-4 py-3" placeholder="Tên sản phẩm *" />
      <input name="slug" required className="rounded-2xl border px-4 py-3" placeholder="Slug, ví dụ: nhom-xingfa-he-55 *" />
      <input name="sku" className="rounded-2xl border px-4 py-3" placeholder="Mã sản phẩm" />
      <textarea name="shortDesc" className="min-h-24 rounded-2xl border px-4 py-3" placeholder="Mô tả ngắn" />
      <div className="grid gap-4 md:grid-cols-2">
        <select name="categoryId" required className="rounded-2xl border px-4 py-3">
          <option value="">Chọn danh mục *</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select name="brandId" className="rounded-2xl border px-4 py-3">
          <option value="">Không chọn thương hiệu</option>
          {brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <input name="price" type="number" min="0" step="1" className="rounded-2xl border px-4 py-3" placeholder="Giá bán" />
        <input name="unit" className="rounded-2xl border px-4 py-3" placeholder="Đơn vị" />
        <select name="status" className="rounded-2xl border px-4 py-3">
          <option value="DRAFT">Bản nháp</option>
          <option value="PUBLISHED">Công khai</option>
        </select>
      </div>
      <input name="imageUrl" className="rounded-2xl border px-4 py-3" placeholder="URL ảnh đại diện" />
      <button disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "Đang lưu..." : "Tạo sản phẩm"}
      </button>
      {message && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{message}</p>}
    </form>
  );
}
