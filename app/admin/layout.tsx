import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex min-h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-black text-brand-800">CÔNG THẢNH CMS</Link>
            <nav className="hidden gap-4 text-sm font-semibold md:flex">
              <Link href="/admin/products">Sản phẩm</Link>
              <Link href="/admin/quotes">Báo giá</Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
