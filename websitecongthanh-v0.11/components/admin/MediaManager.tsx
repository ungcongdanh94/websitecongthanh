"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { Check, Clipboard, ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";

type Asset = {
  id: string; secureUrl: string; fileName: string; bytes: number; width: number | null; height: number | null; folder: string;
};

export default function MediaManager({ initialAssets }: { initialAssets: Asset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [files, setFiles] = useState<File[]>([]);
  const [folder, setFolder] = useState("general");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);

  function choose(next: FileList | File[]) {
    const accepted = Array.from(next).filter((file) => file.type.startsWith("image/")).slice(0, 12);
    setFiles(accepted);
    setMessage(accepted.length ? `${accepted.length} ảnh đã sẵn sàng` : "Không có ảnh hợp lệ");
  }

  async function upload() {
    if (!files.length) return;
    setBusy(true); setMessage("");
    const body = new FormData();
    files.forEach((file) => body.append("files", file));
    body.append("folder", folder);
    const response = await fetch("/api/admin/media", { method: "POST", body });
    const result = await response.json();
    if (response.ok) {
      setAssets((current) => [...result.assets, ...current]);
      setFiles([]);
      setMessage(`Đã tải lên ${result.assets.length} ảnh`);
    } else setMessage(result.message || "Tải ảnh thất bại");
    setBusy(false);
  }

  async function remove(asset: Asset) {
    if (!confirm(`Xóa ảnh ${asset.fileName}?`)) return;
    const response = await fetch(`/api/admin/media/${asset.id}`, { method: "DELETE" });
    if (response.ok) setAssets((current) => current.filter((item) => item.id !== asset.id));
    else { const result = await response.json(); alert(result.message || "Không thể xóa ảnh"); }
  }

  async function copy(asset: Asset) {
    await navigator.clipboard.writeText(asset.secureUrl);
    setCopied(asset.id);
    setTimeout(() => setCopied(""), 1500);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          <div onDragOver={(e: DragEvent) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); choose(e.dataTransfer.files); }} onClick={() => inputRef.current?.click()} className="grid min-h-56 cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-8 text-center transition hover:bg-brand-50">
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files && choose(e.target.files)} />
            <div><UploadCloud className="mx-auto h-12 w-12 text-brand-700"/><div className="mt-4 text-xl font-black">Kéo thả ảnh vào đây</div><div className="mt-2 text-sm text-slate-500">JPG, PNG, WebP, GIF · tối đa 10 MB/ảnh · 12 ảnh/lần</div></div>
          </div>
          <div className="space-y-4">
            <label className="block"><span className="mb-2 block text-sm font-bold">Nhóm ảnh</span><select value={folder} onChange={(e) => setFolder(e.target.value)} className="w-full rounded-2xl border px-4 py-3"><option value="general">Chung</option><option value="products">Sản phẩm</option><option value="projects">Dự án</option><option value="banners">Banner</option><option value="logos">Logo</option></select></label>
            <button onClick={upload} disabled={!files.length || busy} className="btn-primary w-full disabled:opacity-50">{busy ? <><Loader2 className="h-4 w-4 animate-spin"/> Đang tải...</> : <><ImagePlus className="h-4 w-4"/> Tải ảnh lên</>}</button>
            {message && <div className="rounded-2xl bg-slate-100 p-3 text-sm font-semibold">{message}</div>}
          </div>
        </div>
        {!!previews.length && <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8">{previews.map(({file,url}) => <div key={`${file.name}-${file.size}`} className="relative aspect-square overflow-hidden rounded-xl bg-slate-100"><Image src={url} alt={file.name} fill className="object-cover" unoptimized /></div>)}</div>}
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between"><div><h2 className="text-2xl font-black">Thư viện ảnh</h2><p className="mt-1 text-sm text-slate-500">{assets.length} ảnh gần nhất</p></div></div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {assets.map((asset) => (
            <article key={asset.id} className="overflow-hidden rounded-3xl border bg-white">
              <div className="relative aspect-square bg-slate-100"><Image src={asset.secureUrl} alt={asset.fileName} fill className="object-cover" /></div>
              <div className="p-4"><div className="truncate text-sm font-bold" title={asset.fileName}>{asset.fileName}</div><div className="mt-1 text-xs text-slate-500">{asset.width && asset.height ? `${asset.width} × ${asset.height} · ` : ""}{(asset.bytes/1024).toFixed(0)} KB</div><div className="mt-3 flex gap-2"><button onClick={() => copy(asset)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold">{copied===asset.id ? <Check className="h-4 w-4"/> : <Clipboard className="h-4 w-4"/>}{copied===asset.id ? "Đã chép" : "Chép URL"}</button><button onClick={() => remove(asset)} className="rounded-xl border border-red-200 p-2 text-red-600"><Trash2 className="h-4 w-4"/></button></div></div>
            </article>
          ))}
        </div>
        {!assets.length && <div className="rounded-3xl border border-dashed p-16 text-center text-slate-500">Chưa có ảnh trong thư viện.</div>}
      </section>
    </div>
  );
}
