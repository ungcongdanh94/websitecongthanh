import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="container-page flex min-h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-7">
            <Link href="/admin" className="font-black text-brand-800">
              CÔNG THẢNH CMS
            </Link>
            <AdminNav />
          </div>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
