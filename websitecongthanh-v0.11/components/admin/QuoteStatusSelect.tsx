"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QuoteStatusSelect({
  quoteId,
  status
}: {
  quoteId: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);

  async function update(nextStatus: string) {
    setValue(nextStatus);
    setLoading(true);

    const response = await fetch(`/api/admin/quotes/${quoteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    });

    setLoading(false);
    if (response.ok) router.refresh();
  }

  return (
    <select
      value={value}
      disabled={loading}
      onChange={(event) => update(event.target.value)}
      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold"
    >
      <option value="NEW">Mới</option>
      <option value="CONTACTED">Đã liên hệ</option>
      <option value="QUOTED">Đã báo giá</option>
      <option value="WON">Thành công</option>
      <option value="LOST">Không thành công</option>
    </select>
  );
}
