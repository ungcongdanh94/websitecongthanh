"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({
  productId,
  productName
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    const confirmed = window.confirm(`Xóa sản phẩm “${productName}”?`);
    if (!confirmed) return;

    setLoading(true);
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      alert(result?.message || "Không thể xóa sản phẩm");
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={loading}
      className="text-sm font-semibold text-red-600 disabled:opacity-50"
    >
      {loading ? "Đang xóa..." : "Xóa"}
    </button>
  );
}
