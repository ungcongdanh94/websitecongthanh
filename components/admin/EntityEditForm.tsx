"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Entity = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
};

export default function EntityEditForm({
  endpoint,
  label,
  entity
}: {
  endpoint: string;
  label: string;
  entity: Entity;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const body = {
      ...Object.fromEntries(formData.entries()),
      isActive: formData.get("isActive") === "on"
    };

    const response = await fetch(`${endpoint}/${entity.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    if (!response.ok) {
      setMessage(result.message || "Không thể lưu thay đổi");
      setLoading(false);
      return;
    }

    setMessage("Đã lưu thay đổi.");
    router.refresh();
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-3xl border bg-white p-6">
      <input name="name" required defaultValue={entity.name} className="rounded-2xl border px-4 py-3" placeholder={`Tên ${label.toLowerCase()} *`} />
      <input name="slug" required defaultValue={entity.slug} className="rounded-2xl border px-4 py-3" placeholder="Slug *" />
      <input name="description" defaultValue={entity.description || ""} className="rounded-2xl border px-4 py-3" placeholder="Mô tả" />
      <label className="flex items-center gap-3 rounded-2xl border px-4 py-3">
        <input type="checkbox" name="isActive" defaultChecked={entity.isActive} className="h-4 w-4 accent-brand-600" />
        <span className="text-sm font-semibold">Đang hoạt động (hiện trên website)</span>
      </label>
      <button disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
      {message && <p className="text-sm font-semibold text-brand-700">{message}</p>}
    </form>
  );
}
