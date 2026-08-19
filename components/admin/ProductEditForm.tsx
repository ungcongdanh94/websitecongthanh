"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import MediaPicker from "@/components/admin/MediaPicker";
import GalleryPicker from "@/components/admin/GalleryPicker";
import MarkdownEditor from "@/components/admin/MarkdownEditor";

type Option = { id: string; name: string };

type ProductData = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  shortDesc: string | null;
  description: string | null;
  imageUrl: string | null;
  gallery: string[];
  price: number | null;
  dealerPrice: number | null;
  unit: string | null;
  productLine: string | null;
  aluminumSystem: string | null;
  color: string | null;
  thickness: string | null;
  stockLength: string | null;
  catalogUrl: string | null;
  videoUrl: string | null;
  warrantyPolicy: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: string;
  brandId: string | null;
  isFeatured: boolean;
};

const input = "rounded-2xl border border-slate-200 px-4 py-3";

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

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-3xl border bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <input name="name" required defaultValue={product.name} className={input} placeholder="Tên sản phẩm" />
        <input name="slug" required defaultValue={product.slug} className={input} placeholder="Slug" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input name="sku" defaultValue={product.sku || ""} className={input} placeholder="Mã sản phẩm" />
        <input name="productLine" defaultValue={product.productLine || ""} className={input} placeholder="Dòng sản phẩm" />
      </div>

      <textarea name="shortDesc" defaultValue={product.shortDesc || ""} className={`${input} min-h-24`} placeholder="Mô tả ngắn" />
      <MarkdownEditor name="description" defaultValue={product.description || ""} placeholder="Mô tả chi tiết" />

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
        <input name="aluminumSystem" defaultValue={product.aluminumSystem || ""} className={input} placeholder="Hệ nhôm" />
        <input name="color" defaultValue={product.color || ""} className={input} placeholder="Màu sắc — VD: Trắng #FFFFFF, Ghi xám #9CA3AF" />
        <input name="thickness" defaultValue={product.thickness || ""} className={input} placeholder="Độ dày — nhiều giá trị: 1.4mm, 2.0mm" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <input name="stockLength" defaultValue={product.stockLength || ""} className={input} placeholder="Chiều dài thanh — nhiều giá trị: 3000mm, 6000mm" />
        <input name="unit" defaultValue={product.unit || ""} className={input} placeholder="Đơn vị" />
        <select name="status" defaultValue={product.status} className={input}>
          <option value="DRAFT">Bản nháp</option>
          <option value="PUBLISHED">Công khai</option>
          <option value="ARCHIVED">Lưu trữ</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input name="price" type="number" min="0" step="1" defaultValue={product.price ?? ""} className={input} placeholder="Giá bán lẻ" />
        <input name="dealerPrice" type="number" min="0" step="1" defaultValue={product.dealerPrice ?? ""} className={input} placeholder="Giá đại lý" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input name="catalogUrl" defaultValue={product.catalogUrl || ""} className={input} placeholder="URL catalogue PDF" />
        <input name="videoUrl" defaultValue={product.videoUrl || ""} className={input} placeholder="URL video giới thiệu" />
      </div>

      <textarea
        name="warrantyPolicy"
        defaultValue={product.warrantyPolicy || ""}
        className={`${input} min-h-24`}
        placeholder="Chính sách bảo hành riêng cho sản phẩm này — VD: Bảo hành 10 năm khung nhôm, 2 năm phụ kiện."
      />

      <div className="rounded-2xl border border-dashed border-slate-300 p-4">
        <div className="mb-3 text-xs font-bold uppercase text-slate-500">SEO (tùy chọn — để trống sẽ tự dùng tên/mô tả sản phẩm)</div>
        <div className="grid gap-3">
          <input name="seoTitle" defaultValue={product.seoTitle || ""} className={input} placeholder="SEO Title (nếu khác tên sản phẩm)" maxLength={70} />
          <textarea name="seoDescription" defaultValue={product.seoDescription || ""} className={`${input} min-h-20`} placeholder="SEO Description (khuyến nghị 120-160 ký tự)" maxLength={200} />
          <MediaPicker name="ogImage" defaultValue={product.ogImage || ""} label="Ảnh chia sẻ mạng xã hội (Open Graph) — để trống sẽ dùng ảnh đại diện" />
        </div>
      </div>

      <MediaPicker name="imageUrl" defaultValue={product.imageUrl || ""} label="Ảnh đại diện sản phẩm" />
      <GalleryPicker name="gallery" defaultValue={product.gallery} label="Thư viện ảnh chi tiết (nhiều ảnh)" />

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
