"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Customer = {
  id?: string;
  name?: string;
  phone?: string;
  email?: string | null;
  company?: string | null;
  address?: string | null;
  note?: string | null;
  source?: string | null;
};

const field =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export default function CustomerForm({ customer = {} }: { customer?: Customer }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    const url = customer.id ? `/api/admin/customers/${customer.id}` : "/api/admin/customers";
    const method = customer.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    if (!response.ok) {
      setMessage(result.message || "Không thể lưu khách hàng");
      setLoading(false);
      return;
    }

    if (customer.id) {
      router.refresh();
      setMessage("Đã lưu thay đổi.");
      setLoading(false);
    } else {
      router.push(`/admin/customers/${result.customer.id}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-3xl border bg-white p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <input name="name" required defaultValue={customer.name || ""} className={field} placeholder="Tên khách hàng *" />
        <input name="phone" required defaultValue={customer.phone || ""} className={field} placeholder="Số điện thoại *" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input name="email" type="email" defaultValue={customer.email || ""} className={field} placeholder="Email" />
        <input name="company" defaultValue={customer.company || ""} className={field} placeholder="Công ty / xưởng" />
      </div>
      <input name="address" defaultValue={customer.address || ""} className={field} placeholder="Địa chỉ" />
      <div className="grid gap-4 md:grid-cols-2">
        <input name="source" defaultValue={customer.source || ""} className={field} placeholder="Nguồn khách hàng (Zalo, giới thiệu...)" />
      </div>
      <textarea name="note" defaultValue={customer.note || ""} className={`${field} min-h-24`} placeholder="Ghi chú nội bộ" />
      <button disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? "Đang lưu..." : customer.id ? "Lưu thay đổi" : "Tạo khách hàng"}
      </button>
      {message && <p className="text-sm font-semibold text-brand-700">{message}</p>}
    </form>
  );
}
