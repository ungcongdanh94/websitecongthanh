"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send } from "lucide-react";

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

const fieldClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100";

export default function QuoteForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const productFromUrl = searchParams.get("product");
    if (productFromUrl) {
      setForm((current) => ({ ...current, productName: productFromUrl }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          quantity: form.quantity ? Number(form.quantity) : undefined,
          sourceUrl: typeof window !== "undefined" ? window.location.href : undefined
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
    <form onSubmit={submit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            required
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            className={fieldClass}
            placeholder="Họ và tên *"
          />
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={fieldClass}
            placeholder="Số điện thoại *"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={fieldClass}
            placeholder="Email"
          />
          <input
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className={fieldClass}
            placeholder="Tên công ty/xưởng"
          />
        </div>
        <input
          value={form.productName}
          onChange={(e) => setForm({ ...form, productName: e.target.value })}
          className={fieldClass}
          placeholder="Sản phẩm quan tâm"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className={fieldClass}
            placeholder="Số lượng"
          />
          <input
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            className={fieldClass}
            placeholder="Đơn vị"
          />
        </div>
        <textarea
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className={`${fieldClass} min-h-36 resize-y`}
          placeholder="Nội dung cần tư vấn"
        />
        <button disabled={status === "loading"} className="btn-primary mt-1 disabled:opacity-60">
          {status === "loading" ? "Đang gửi..." : "Gửi yêu cầu báo giá"}
          <Send className="ml-2 h-4 w-4" />
        </button>
        {message && (
          <p
            className={`rounded-2xl p-4 text-sm ${
              status === "success"
                ? "bg-brand-50 text-brand-800"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
