import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const quoteStatusLabel: Record<string, string> = {
  NEW: "Mới",
  CONTACTED: "Đã liên hệ",
  QUOTED: "Đã báo giá",
  WON: "Thành công",
  LOST: "Không thành công"
};

export default async function AdminDashboard() {
  const [
    productCount,
    publishedProductCount,
    categoryCount,
    brandCount,
    projectCount,
    quoteCount,
    newQuoteCount,
    recentQuotes,
    recentMessages
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.category.count(),
    prisma.brand.count(),
    prisma.project.count(),
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: "NEW" } }),
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 6
    }),
    prisma.contactMessage.count({ where: { isRead: false } }).catch(() => 0)
  ]);

  const stats = [
    { label: "Sản phẩm", value: productCount, sub: `${publishedProductCount} công khai`, href: "/admin/products" },
    { label: "Danh mục", value: categoryCount, sub: "Đang quản lý", href: "/admin/categories" },
    { label: "Thương hiệu", value: brandCount, sub: "Đối tác phân phối", href: "/admin/brands" },
    { label: "Dự án", value: projectCount, sub: "Công trình đã đăng", href: "/admin/projects" },
    { label: "Báo giá", value: quoteCount, sub: `${newQuoteCount} chưa xử lý`, href: "/admin/quotes" },
    { label: "Tin nhắn chưa đọc", value: recentMessages, sub: "Từ trang liên hệ", href: "/admin" }
  ];

  return (
    <main className="container-page py-12">
      <div>
        <div className="eyebrow">CMS</div>
        <h1 className="mt-3 text-4xl font-black">Tổng quan</h1>
        <p className="mt-3 text-slate-600">Số liệu nhanh về sản phẩm, dự án và báo giá.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-3xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="text-sm font-bold uppercase tracking-widest text-brand-700">{item.label}</div>
            <div className="mt-3 text-4xl font-black text-slate-950">{item.value}</div>
            <div className="mt-1 text-sm text-slate-500">{item.sub}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border bg-white">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-black">Báo giá gần đây</h2>
          <Link href="/admin/quotes" className="text-sm font-bold text-brand-700">Xem tất cả →</Link>
        </div>
        {recentQuotes.length ? (
          <div className="divide-y">
            {recentQuotes.map((quote) => (
              <Link
                key={quote.id}
                href={`/admin/quotes/${quote.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-slate-50"
              >
                <div>
                  <div className="font-bold">{quote.customerName}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {quote.quoteNumber || quote.id} · {new Date(quote.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-slate-700">
                    {Number(quote.total).toLocaleString("vi-VN")} đ
                  </span>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800">
                    {quoteStatusLabel[quote.status] || quote.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-slate-500">Chưa có báo giá nào.</div>
        )}
      </div>
    </main>
  );
}
