"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImageIcon, X } from "lucide-react";

type Asset = { id: string; secureUrl: string; fileName: string };

export default function MediaPicker({ name, defaultValue = "", label = "Ảnh đại diện" }: { name: string; defaultValue?: string; label?: string }) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/admin/media")
      .then((response) => response.json())
      .then((result) => setAssets(result.assets || []))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <div className="mb-2 text-sm font-bold text-slate-700">{label}</div>
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 p-4">
        {value ? (
          <div className="relative h-24 w-32 overflow-hidden rounded-xl bg-slate-100">
            <Image src={value} alt={label} fill className="object-cover" />
          </div>
        ) : (
          <div className="grid h-24 w-32 place-items-center rounded-xl bg-slate-100 text-slate-400"><ImageIcon /></div>
        )}
        <div className="flex gap-2">
          <button type="button" onClick={() => setOpen(true)} className="rounded-xl bg-brand-700 px-4 py-2 text-sm font-bold text-white">Chọn từ thư viện</button>
          {value && <button type="button" onClick={() => setValue("")} className="rounded-xl border px-4 py-2 text-sm font-bold">Bỏ ảnh</button>}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/60 p-4">
          <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-5">
              <div><div className="text-xl font-black">Chọn ảnh</div><div className="text-sm text-slate-500">Ảnh trong Media Manager</div></div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl p-2 hover:bg-slate-100"><X /></button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto p-5">
              {loading ? <div className="py-16 text-center text-slate-500">Đang tải thư viện...</div> : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {assets.map((asset) => (
                    <button key={asset.id} type="button" onClick={() => { setValue(asset.secureUrl); setOpen(false); }} className="group text-left">
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 ring-brand-500 group-hover:ring-4">
                        <Image src={asset.secureUrl} alt={asset.fileName} fill className="object-cover" />
                      </div>
                      <div className="mt-2 truncate text-xs font-semibold">{asset.fileName}</div>
                    </button>
                  ))}
                </div>
              )}
              {!loading && !assets.length && <div className="py-16 text-center text-slate-500">Chưa có ảnh. Hãy tải ảnh tại mục Media.</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
