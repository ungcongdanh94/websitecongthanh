"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import MediaPicker from "@/components/admin/MediaPicker";

const field = "w-full rounded-2xl border border-slate-200 px-4 py-3";

export default function BannerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      ...Object.fromEntries(formData.entries()),
      isActive: formData.get("isActive") === "on"
    };

    const response = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) {
      setMessage(result.message || "Không thể lưu banner");
      setLoading(false);
      return;
    }

    event.currentTarget.reset();
    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-3xl border bg-white p-6">
      <input name="title" required className={field} placeholder="Tiêu đề *" />
      <input name="subtitle" className={field} placeholder="Dòng mô tả" />
      <MediaPicker name="imageUrl" label="Ảnh nền banner" />
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="buttonLabel" className={field} placeholder="Nhãn nút" />
        <input name="buttonUrl" className={field} placeholder="Đường dẫn nút" />
      </div>
      <input name="sortOrder" type="number" defaultValue="0" className={field} placeholder="Thứ tự" />
      <label className="flex items-center gap-3">
        <input name="isActive" type="checkbox" defaultChecked />
        <span className="font-semibold">Đang hoạt động</span>
      </label>
      <button disabled={loading} className="btn-primary disabled:opacity-60">{loading ? "Đang lưu..." : "Thêm banner"}</button>
      {message && <p className="text-sm text-red-600">{message}</p>}
    </form>
  );
}
