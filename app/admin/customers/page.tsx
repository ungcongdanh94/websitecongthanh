import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CustomersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  const customers = await prisma.customer.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { company: { contains: q, mode: "insensitive" } }
          ]
        }
      : undefined,
    include: {
      quotes: { select: { total: true, status: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">CRM</div>
          <h1 className="mt-3 text-4xl font-black">Khách hàng</h1>
          <p className="mt-3 text-slate-600">Theo dõi thông tin và lịch sử báo giá theo từng khách hàng.</p>
        </div>
        <Link href="/admin/customers/new" className="btn-primary">Thêm khách hàng</Link>
      </div>

      <form className="mt-6 max-w-xl">
        <input
          name="q"
          defaultValue={q}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
          placeholder="Tìm theo tên, số điện thoại hoặc công ty..."
        />
      </form>

      <div className="mt-6 overflow-hidden rounded-3xl border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4">Khách hàng</th>
                <th className="px-5 py-4">Công ty</th>
                <th className="px-5 py-4">Số báo giá</th>
                <th className="px-5 py-4">Tổng giá trị</th>
                <th className="px-5 py-4">Ngày thêm</th>
                <th className="px-5 py-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const totalValue = customer.quotes.reduce((sum, quote) => sum + Number(quote.total), 0);
                return (
                  <tr key={customer.id} className="border-t align-top">
                    <td className="px-5 py-4">
                      <div className="font-semibold">{customer.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{customer.phone}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{customer.company || "—"}</td>
                    <td className="px-5 py-4">{customer.quotes.length}</td>
                    <td className="px-5 py-4 font-semibold">{totalValue.toLocaleString("vi-VN")} đ</td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(customer.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/customers/${customer.id}`} className="font-semibold text-brand-700">
                        Xem hồ sơ
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {!customers.length && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    Chưa có khách hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
