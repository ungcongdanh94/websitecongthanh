"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import MediaPicker from "@/components/admin/MediaPicker";

type Option = { id: string; name: string };

type ProductData = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  shortDesc: string | null;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  unit: string | null;
  status: "DRAFT" | "PUBLISHED";
  categoryId: string;
  brandId: string | null;
  isFeatured: boolean;
};

export default function ProductEditForm({
  product,
  categories,
  brands
}: {
  product: ProductData;
  categories: Option[];
  brands: Option[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          isFeatured: formData.get("isFeatured") === "on"
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Không thể cập nhật sản phẩm");

      setMessage("Đã cập nhật sản phẩm.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  const input = "rounded-2xl border border-slate-200 px-4 py-3";

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-3xl border bg-white p-6">
      <input name="name" required defaultValue={product.name} className={input} placeholder="Tên sản phẩm" />
      <input name="slug" required defaultValue={product.slug} className={input} placeholder="Slug" />
      <input name="sku" defaultValue={product.sku || ""} className={input} placeholder="Mã sản phẩm" />
      <textarea name="shortDesc" defaultValue={product.shortDesc || ""} className={`${input} min-h-24`} placeholder="Mô tả ngắn" />
      <textarea name="description" defaultValue={product.description || ""} className={`${input} min-h-40`} placeholder="Mô tả chi tiết" />
      <div className="grid gap-4 md:grid-cols-2">
        <select name="categoryId" required defaultValue={product.categoryId} className={input}>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select name="brandId" defaultValue={product.brandId || ""} className={input}>
          <option value="">Không chọn thương hiệu</option>
          {brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <input name="price" type="number" min="0" step="1" defaultValue={product.price ?? ""} className={input} placeholder="Giá bán" />
        <input name="unit" defaultValue={product.unit || ""} className={input} placeholder="Đơn vị" />
        <select name="status" defaultValue={product.status} className={input}>
          <option value="DRAFT">Bản nháp</option>
          <option value="PUBLISHED">Công khai</option>
        </select>
      </div>
      <MediaPicker name="imageUrl" defaultValue={product.imageUrl || ""} label="Ảnh đại diện sản phẩm" />
      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
        <input name="isFeatured" type="checkbox" defaultChecked={product.isFeatured} />
        <span className="font-semibold">Đánh dấu là sản phẩm nổi bật</span>
      </label>
      <button disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
      {message && <p className="rounded-2xl bg-brand-50 p-3 text-sm text-brand-800">{message}</p>}
    </form>
  );
}
