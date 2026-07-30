"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string | null;
  coverUrl?: string | null;
  location?: string | null;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

const field =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export default function ProjectForm({ project = {} }: { project?: Project }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    const url = project.id ? `/api/admin/projects/${project.id}` : "/api/admin/projects";
    const method = project.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    if (!response.ok) {
      setMessage(result.message || "Không thể lưu dự án");
      setLoading(false);
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-3xl border bg-white p-6">
      <input name="title" required defaultValue={project.title || ""} className={field} placeholder="Tên dự án *" />
      <input name="slug" required defaultValue={project.slug || ""} className={field} placeholder="Slug *" />
      <input name="location" defaultValue={project.location || ""} className={field} placeholder="Địa điểm" />
      <input name="coverUrl" defaultValue={project.coverUrl || ""} className={field} placeholder="URL ảnh đại diện" />
      <textarea name="description" defaultValue={project.description || ""} className={`${field} min-h-40`} placeholder="Mô tả dự án" />
      <select name="status" defaultValue={project.status || "DRAFT"} className={field}>
        <option value="DRAFT">Bản nháp</option>
        <option value="PUBLISHED">Công khai</option>
        <option value="ARCHIVED">Lưu trữ</option>
      </select>
      <button disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "Đang lưu..." : project.id ? "Lưu thay đổi" : "Tạo dự án"}
      </button>
      {message && <p className="text-sm text-red-600">{message}</p>}
    </form>
  );
}
