"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EntityDeleteButton({
  endpoint,
  id,
  name,
  redirectTo
}: {
  endpoint: string;
  id: string;
  name: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    if (!confirm(`Xóa "${name}"? Không thể hoàn tác.`)) return;
    setLoading(true);
    const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      alert(result?.message || "Không thể xóa");
      setLoading(false);
      return;
    }

    if (redirectTo) {
      router.push(redirectTo);
    }
    router.refresh();
  }

  return (
    <button type="button" onClick={remove} disabled={loading} className="text-sm font-semibold text-red-600 disabled:opacity-50">
      {loading ? "Đang xóa..." : "Xóa"}
    </button>
  );
}
