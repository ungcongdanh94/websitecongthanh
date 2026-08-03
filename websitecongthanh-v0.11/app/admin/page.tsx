import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [productCount, quoteCount, newQuoteCount] = await Promise.all([
    prisma.product.count(),
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: "NEW" } })
  ]);

  const cards = [
    { label: "Sản phẩm", value: productCount, href: "/admin/products" },
    { label: "Tổng yêu cầu báo giá", value: quoteCount, href: "/admin/quotes" },
    { label: "Báo giá mới", value: newQuoteCount, href: "/admin/quotes" }
  ];

  return (
    <main className="container-page py-12">
      <div>
        <div className="text-sm font-bold uppercase tracking-widest text-brand-700">Dashboard</div>
        <h1 className="mt-3 text-4xl font-black">Trung tâm quản trị</h1>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="text-sm text-slate-500">{card.label}</div>
            <div className="mt-3 text-4xl font-black">{card.value}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
