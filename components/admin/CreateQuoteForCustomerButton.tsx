"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateQuoteForCustomerButton({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function createQuote() {
    setLoading(true);
    const response = await fetch("/api/admin/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId })
    });
    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Không thể tạo báo giá");
      setLoading(false);
      return;
    }

    router.push(`/admin/quotes/${result.quote.id}`);
  }

  return (
    <button onClick={createQuote} disabled={loading} className="btn-primary disabled:opacity-60">
      {loading ? "Đang tạo..." : "Tạo báo giá cho khách này"}
    </button>
  );
}
