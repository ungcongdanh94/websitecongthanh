"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import MediaPicker from "@/components/admin/MediaPicker";

export default function SimpleEntityForm({
  endpoint,
  label,
  showLogo = false
}: {
  endpoint: string;
  label: string;
  showLogo?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    const result = await response.json();
    if (!response.ok) {
      setMessage(result.message || "Không thể lưu dữ liệu");
      setLoading(false);
      return;
    }

    event.currentTarget.reset();
    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-3xl border bg-white p-6">
      <input name="name" required className="rounded-2xl border px-4 py-3" placeholder={`Tên ${label.toLowerCase()} *`} />
      <input name="slug" required className="rounded-2xl border px-4 py-3" placeholder="Slug *" />
      <input name="description" className="rounded-2xl border px-4 py-3" placeholder="Mô tả" />
      {showLogo && <MediaPicker name="logoUrl" label="Logo thương hiệu" />}
      <button disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "Đang lưu..." : `Thêm ${label.toLowerCase()}`}
      </button>
      {message && <p className="text-sm text-red-600">{message}</p>}
    </form>
  );
}
