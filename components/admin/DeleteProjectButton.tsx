"use client";

import { useRouter } from "next/navigation";

export default function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  async function remove() {
    if (!confirm(`Xóa dự án "${title}"?`)) return;
    const response = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (response.ok) router.refresh();
    else alert("Không thể xóa dự án");
  }

  return (
    <button onClick={remove} className="font-semibold text-red-600">
      Xóa
    </button>
  );
}
