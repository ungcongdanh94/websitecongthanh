"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ApiKeyItem = {
  id: string;
  key: string;
  label: string;
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
};

export default function ApiKeyManager({ initialKeys }: { initialKeys: ApiKeyItem[] }) {
  const router = useRouter();
  const [keys, setKeys] = useState(initialKeys);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [justCreated, setJustCreated] = useState<string | null>(null);

  async function createKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/admin/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label })
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      alert(result.message || "Không thể tạo API key");
      return;
    }

    setKeys((current) => [result.apiKey, ...current]);
    setJustCreated(result.apiKey.key);
    setLabel("");
  }

  async function toggleActive(id: string, isActive: boolean) {
    const response = await fetch(`/api/admin/api-keys/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive })
    });
    if (response.ok) {
      setKeys((current) => current.map((item) => (item.id === id ? { ...item, isActive } : item)));
    }
  }

  async function remove(id: string, label: string) {
    if (!confirm(`Xóa vĩnh viễn API key "${label}"? Plugin đang dùng key này sẽ ngừng hoạt động.`)) return;
    const response = await fetch(`/api/admin/api-keys/${id}`, { method: "DELETE" });
    if (response.ok) {
      setKeys((current) => current.filter((item) => item.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createKey} className="flex flex-wrap items-end gap-3 rounded-3xl border bg-white p-5">
        <div className="flex-1 min-w-[220px]">
          <label className="mb-1 block text-sm font-bold text-slate-700">Tên API key</label>
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            required
            placeholder="Ví dụ: SketchUp Plugin — xưởng chính"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </div>
        <button disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? "Đang tạo..." : "Tạo API key"}
        </button>
      </form>

      {justCreated && (
        <div className="rounded-3xl border border-amber-300 bg-amber-50 p-5">
          <p className="text-sm font-bold text-amber-900">
            Đã tạo key mới — copy và lưu lại ngay, key sẽ không hiển thị đầy đủ lần sau:
          </p>
          <code className="mt-2 block break-all rounded-xl bg-white px-4 py-3 text-sm">{justCreated}</code>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4">Tên</th>
              <th className="px-5 py-4">Key</th>
              <th className="px-5 py-4">Dùng lần cuối</th>
              <th className="px-5 py-4">Trạng thái</th>
              <th className="px-5 py-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((item) => (
              <tr key={item.id} className="border-t align-top">
                <td className="px-5 py-4 font-semibold">{item.label}</td>
                <td className="px-5 py-4 font-mono text-xs text-slate-500">
                  {item.key.slice(0, 12)}••••••••
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {item.lastUsedAt ? new Date(item.lastUsedAt).toLocaleString("vi-VN") : "Chưa dùng"}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      item.isActive ? "bg-brand-50 text-brand-800" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.isActive ? "Đang hoạt động" : "Đã thu hồi"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleActive(item.id, !item.isActive)}
                      className="font-semibold text-brand-700"
                    >
                      {item.isActive ? "Thu hồi" : "Kích hoạt lại"}
                    </button>
                    <button onClick={() => remove(item.id, item.label)} className="font-semibold text-red-600">
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!keys.length && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  Chưa có API key nào. Tạo key đầu tiên để kết nối plugin SketchUp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
