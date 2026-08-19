"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImageIcon, X } from "lucide-react";

type Asset = { id: string; secureUrl: string; fileName: string };

export default function GalleryPicker({
  name,
  defaultValue = [],
  label = "Thư viện ảnh sản phẩm"
}: {
  name: string;
  defaultValue?: string[];
  label?: string;
}) {
  const [values, setValues] = useState<string[]>(defaultValue);
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function reorder(fromIndex: number, toIndex: number) {
    setValues((current) => {
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/admin/media")
      .then((response) => response.json())
      .then((result) => setAssets(result.assets || []))
      .finally(() => setLoading(false));
  }, [open]);

  function toggle(url: string) {
    setValues((current) =>
      current.includes(url) ? current.filter((item) => item !== url) : [...current, url]
    );
  }

  function remove(url: string) {
    setValues((current) => current.filter((item) => item !== url));
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(values)} />
      <div className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700">
        <span>{label}</span>
        {values.length > 1 && <span className="text-xs font-normal text-slate-400">Kéo thả để đổi thứ tự</span>}
      </div>
      <div className="rounded-2xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3">
          {values.map((url, index) => (
            <div
              key={url}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (dragIndex !== null && dragIndex !== index) reorder(dragIndex, index);
                setDragIndex(null);
              }}
              onDragEnd={() => setDragIndex(null)}
              className={`relative h-20 w-24 cursor-move overflow-hidden rounded-xl bg-slate-100 transition ${
                dragIndex === index ? "opacity-40" : ""
              }`}
            >
              <Image src={url} alt="" fill className="object-cover" />
              <span className="absolute bottom-1 left-1 grid h-5 w-5 place-items-center rounded-full bg-slate-950/70 text-[10px] font-bold text-white">
                {index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-slate-950/70 text-white"
                aria-label="Bỏ ảnh này"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {!values.length && (
            <div className="grid h-20 w-24 place-items-center rounded-xl bg-slate-100 text-slate-400">
              <ImageIcon className="h-5 w-5" />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 rounded-xl bg-brand-700 px-4 py-2 text-sm font-bold text-white"
        >
          Chọn ảnh từ thư viện
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/60 p-4">
          <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <div className="text-xl font-black">Chọn nhiều ảnh</div>
                <div className="text-sm text-slate-500">Nhấn để thêm/bỏ ảnh khỏi thư viện sản phẩm</div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl p-2 hover:bg-slate-100">
                <X />
              </button>
            </div>
            <div className="max-h-[65vh] overflow-y-auto p-5">
              {loading ? (
                <div className="py-16 text-center text-slate-500">Đang tải thư viện...</div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {assets.map((asset) => {
                    const selected = values.includes(asset.secureUrl);
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => toggle(asset.secureUrl)}
                        className="group text-left"
                      >
                        <div
                          className={`relative aspect-square overflow-hidden rounded-2xl bg-slate-100 ${
                            selected ? "ring-4 ring-brand-500" : "group-hover:ring-4 group-hover:ring-brand-200"
                          }`}
                        >
                          <Image src={asset.secureUrl} alt={asset.fileName} fill className="object-cover" />
                          {selected && (
                            <div className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-brand-700 text-xs font-black text-white">
                              ✓
                            </div>
                          )}
                        </div>
                        <div className="mt-2 truncate text-xs font-semibold">{asset.fileName}</div>
                      </button>
                    );
                  })}
                </div>
              )}
              {!loading && !assets.length && (
                <div className="py-16 text-center text-slate-500">Chưa có ảnh. Hãy tải ảnh tại mục Media.</div>
              )}
            </div>
            <div className="flex justify-end border-t p-4">
              <button type="button" onClick={() => setOpen(false)} className="btn-primary">
                Xong ({values.length} ảnh)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
