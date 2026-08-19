"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DuplicateProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function duplicate() {
    setLoading(true);
    const response = await fetch(`/api/admin/products/${productId}/duplicate`, { method: "POST" });
    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Không thể sao chép sản phẩm");
      setLoading(false);
      return;
    }

    router.push(`/admin/products/${result.product.id}`);
  }

  return (
    <button type="button" onClick={duplicate} disabled={loading} className="text-sm font-semibold text-brand-700 disabled:opacity-50">
      {loading ? "Đang sao chép..." : "Sao chép"}
    </button>
  );
}
