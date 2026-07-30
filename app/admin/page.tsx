import Link from "next/link";
import { Boxes, FileText, FolderKanban, MessageSquareQuote, Newspaper, Tags } from "lucide-react";

const modules = [
  { title: "Sản phẩm", description: "Quản lý sản phẩm, giá và thông số.", icon: Boxes },
  { title: "Danh mục", description: "Nhóm sản phẩm và thứ tự hiển thị.", icon: Tags },
  { title: "Báo giá", description: "Theo dõi yêu cầu báo giá từ khách hàng.", icon: MessageSquareQuote },
  { title: "Dự án", description: "Quản lý hình ảnh và công trình.", icon: FolderKanban },
  { title: "Tin tức", description: "Bài viết và nội dung SEO.", icon: Newspaper },
  { title: "Nội dung", description: "Banner và cấu hình website.", icon: FileText }
];

export default function AdminPage() {
  return (
    <section className="container-page py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm font-bold uppercase tracking-widest text-brand-700">CMS CÔNG THẢNH</div>
          <h1 className="section-title mt-3">Trung tâm quản trị</h1>
          <p className="mt-4 text-slate-600">Khung giao diện CMS v0.2. Đăng nhập và CRUD sẽ hoàn thiện ở sprint kế tiếp.</p>
        </div>
        <Link href="/" className="btn-secondary">Xem website</Link>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {modules.map(({ title, description, icon: Icon }) => (
          <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Icon className="h-8 w-8 text-brand-700" />
            <h2 className="mt-5 text-2xl font-bold">{title}</h2>
            <p className="mt-2 leading-7 text-slate-600">{description}</p>
            <button className="mt-5 text-sm font-bold text-brand-700">Mở mô-đun →</button>
          </article>
        ))}
      </div>
    </section>
  );
}
