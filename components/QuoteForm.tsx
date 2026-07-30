"use client";

import { FormEvent, useState } from "react";

type FormState = {
  customerName: string;
  phone: string;
  email: string;
  company: string;
  productName: string;
  quantity: string;
  unit: string;
  note: string;
};

const initialState: FormState = {
  customerName: "",
  phone: "",
  email: "",
  company: "",
  productName: "",
  quantity: "",
  unit: "bộ",
  note: ""
};

export default function QuoteForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: form.quantity ? Number(form.quantity) : undefined
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Không thể gửi yêu cầu");

      setStatus("success");
      setMessage("CÔNG THẢNH đã nhận yêu cầu. Chúng tôi sẽ liên hệ lại sớm.");
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra");
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="grid gap-4">
        <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Họ và tên *" />
        <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Số điện thoại *" />
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Email" />
        <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Tên công ty/xưởng" />
        <input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Sản phẩm quan tâm" />
        <div className="grid gap-4 sm:grid-cols-2">
          <input type="number" min="0" step="0.01" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Số lượng" />
          <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="rounded-2xl border px-4 py-3" placeholder="Đơn vị" />
        </div>
        <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="min-h-36 rounded-2xl border px-4 py-3" placeholder="Nội dung cần tư vấn" />
        <button disabled={status === "loading"} className="btn-primary disabled:opacity-60">
          {status === "loading" ? "Đang gửi..." : "Gửi yêu cầu báo giá"}
        </button>
        {message && (
          <p className={`rounded-2xl p-3 text-sm ${status === "success" ? "bg-brand-50 text-brand-800" : "bg-red-50 text-red-700"}`}>
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
