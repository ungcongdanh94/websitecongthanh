"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import MediaPicker from "@/components/admin/MediaPicker";
import GalleryPicker from "@/components/admin/GalleryPicker";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

type Option = { id: string; name: string };
const input = "rounded-2xl border border-slate-200 px-4 py-3";

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
        body: JSON.stringify({
          ...payload,
          isFeatured: formData.get("isFeatured") === "on"
        })
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
      <div className="grid gap-4 md:grid-cols-2">
        <input name="name" required className={input} placeholder="Tên sản phẩm *" />
        <input name="slug" required className={input} placeholder="Slug, ví dụ: nhom-xingfa-he-55 *" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input name="sku" className={input} placeholder="Mã sản phẩm" />
        <input name="productLine" className={input} placeholder="Dòng sản phẩm, ví dụ: Class A" />
      </div>

      <textarea name="shortDesc" className={`${input} min-h-24`} placeholder="Mô tả ngắn" />
      <MarkdownEditor name="description" placeholder="Mô tả chi tiết" />

      <div className="grid gap-4 md:grid-cols-2">
        <select name="categoryId" required className={input}>
          <option value="">Chọn danh mục *</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select name="brandId" className={input}>
          <option value="">Không chọn thương hiệu</option>
          {brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <input name="aluminumSystem" className={input} placeholder="Hệ nhôm, ví dụ: Hệ 55" />
        <input name="color" className={input} placeholder="Màu sắc — VD: Trắng #FFFFFF, Ghi xám #9CA3AF (có thể bỏ mã hex, hệ thống tự đoán)" />
        <input name="thickness" className={input} placeholder="Độ dày — có thể nhập nhiều, VD: 1.4mm, 2.0mm" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <input name="stockLength" defaultValue="6000mm" className={input} placeholder="Chiều dài thanh — có thể nhập nhiều, VD: 3000mm, 6000mm" />
        <input name="unit" className={input} placeholder="Đơn vị, ví dụ: kg / thanh / bộ" />
        <select name="status" className={input}>
          <option value="DRAFT">Bản nháp</option>
          <option value="PUBLISHED">Công khai</option>
          <option value="ARCHIVED">Lưu trữ</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input name="price" type="number" min="0" step="1" className={input} placeholder="Giá bán lẻ" />
        <input name="dealerPrice" type="number" min="0" step="1" className={input} placeholder="Giá đại lý" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input name="catalogUrl" className={input} placeholder="URL catalogue PDF" />
        <input name="videoUrl" className={input} placeholder="URL video giới thiệu" />
      </div>

      <textarea
        name="warrantyPolicy"
        className={`${input} min-h-24`}
        placeholder="Chính sách bảo hành riêng cho sản phẩm này — VD: Bảo hành 10 năm khung nhôm, 2 năm phụ kiện."
      />

      <div className="rounded-2xl border border-dashed border-slate-300 p-4">
        <div className="mb-3 text-xs font-bold uppercase text-slate-500">SEO (tùy chọn — để trống sẽ tự dùng tên/mô tả sản phẩm)</div>
        <div className="grid gap-3">
          <input name="seoTitle" className={input} placeholder="SEO Title (nếu khác tên sản phẩm)" maxLength={70} />
          <textarea name="seoDescription" className={`${input} min-h-20`} placeholder="SEO Description (khuyến nghị 120-160 ký tự)" maxLength={200} />
          <MediaPicker name="ogImage" label="Ảnh chia sẻ mạng xã hội (Open Graph) — để trống sẽ dùng ảnh đại diện" />
        </div>
      </div>

      <MediaPicker name="imageUrl" label="Ảnh đại diện sản phẩm" />
      <GalleryPicker name="gallery" label="Thư viện ảnh chi tiết (nhiều ảnh)" />

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
        <input name="isFeatured" type="checkbox" />
        <span className="font-semibold">Đánh dấu là sản phẩm nổi bật</span>
      </label>

      <button disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "Đang lưu..." : "Tạo sản phẩm"}
      </button>
      {message && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{message}</p>}
    </form>
  );
}
