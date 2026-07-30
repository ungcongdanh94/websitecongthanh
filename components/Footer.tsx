import Link from "next/link";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="mt-20 bg-slate-950 text-slate-300">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="text-2xl font-black text-white">{site.name}</div>
          <p className="mt-3 max-w-md text-sm leading-6">{site.tagline}</p>
        </div>
        <div>
          <h3 className="font-bold text-white">Liên kết</h3>
          <div className="mt-3 grid gap-2 text-sm">
            <Link href="/san-pham">Sản phẩm</Link>
            <Link href="/bang-gia">Bảng giá</Link>
            <Link href="/lien-he">Liên hệ</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-white">Thông tin</h3>
          <p className="mt-3 text-sm">{site.address}</p>
          <p className="mt-2 text-sm">{site.website}</p>
          <p className="mt-2 text-sm">Hotline: {site.hotline}</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">© 2026 CÔNG THẢNH. Bản mẫu v0.1.</div>
    </footer>
  );
}
