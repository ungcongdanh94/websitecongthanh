"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Đăng nhập thất bại");

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
      <div className="text-sm font-bold uppercase tracking-widest text-brand-700">CÔNG THẢNH CMS</div>
      <h1 className="mt-3 text-3xl font-black">Đăng nhập quản trị</h1>
      <div className="mt-8 grid gap-4">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-2xl border px-4 py-3"
          placeholder="Email quản trị"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-2xl border px-4 py-3"
          placeholder="Mật khẩu"
        />
        <button disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        {message && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{message}</p>}
      </div>
    </form>
  );
}
