import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CustomerForm from "@/components/admin/CustomerForm";
import DeleteCustomerButton from "@/components/admin/DeleteCustomerButton";
import CreateQuoteForCustomerButton from "@/components/admin/CreateQuoteForCustomerButton";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  NEW: "Mới",
  CONTACTED: "Đã liên hệ",
  QUOTED: "Đã báo giá",
  WON: "Thành công",
  LOST: "Không thành công"
};

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({ where: { id } });
  if (!customer) notFound();

  // Gồm cả báo giá đã liên kết trực tiếp (customerId) và báo giá cũ trùng số điện thoại
  // nhưng chưa được gắn với hồ sơ khách hàng này (dữ liệu lịch sử trước khi có CRM).
  const quotes = await prisma.quoteRequest.findMany({
    where: {
      OR: [{ customerId: id }, { phone: customer.phone, customerId: null }]
    },
    orderBy: { createdAt: "desc" }
  });

  const totalValue = quotes.reduce((sum, quote) => sum + Number(quote.total), 0);
  const wonCount = quotes.filter((quote) => quote.status === "WON").length;

  return (
    <main className="container-page py-12">
      <Link href="/admin/customers" className="text-sm font-bold text-brand-700">← Danh sách khách hàng</Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Hồ sơ khách hàng</div>
          <h1 className="mt-3 text-4xl font-black">{customer.name}</h1>
          <p className="mt-2 text-slate-600">{customer.phone}{customer.company ? ` · ${customer.company}` : ""}</p>
        </div>
        <div className="flex items-center gap-4">
          <CreateQuoteForCustomerButton customerId={customer.id} />
          <DeleteCustomerButton id={customer.id} name={customer.name} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border bg-white p-4 text-center">
              <div className="text-2xl font-black text-brand-800">{quotes.length}</div>
              <div className="text-xs text-slate-500">Báo giá</div>
            </div>
            <div className="rounded-2xl border bg-white p-4 text-center">
              <div className="text-2xl font-black text-brand-800">{wonCount}</div>
              <div className="text-xs text-slate-500">Thành công</div>
            </div>
            <div className="rounded-2xl border bg-white p-4 text-center">
              <div className="text-lg font-black text-brand-800">{totalValue.toLocaleString("vi-VN")}</div>
              <div className="text-xs text-slate-500">Tổng giá trị (đ)</div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-black">Thông tin khách hàng</h2>
            <CustomerForm customer={customer} />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-black">Lịch sử báo giá</h2>
          <div className="overflow-hidden rounded-3xl border bg-white">
            {quotes.length ? (
              <div className="divide-y">
                {quotes.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/admin/quotes/${quote.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50"
                  >
                    <div>
                      <div className="font-semibold">{quote.quoteNumber || quote.id.slice(0, 8)}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {new Date(quote.createdAt).toLocaleDateString("vi-VN")}
                        {quote.customerId === null && " · dữ liệu trước CRM"}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{Number(quote.total).toLocaleString("vi-VN")} đ</span>
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800">
                        {statusLabel[quote.status] || quote.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-slate-500">
                Chưa có báo giá nào. Nhấn “Tạo báo giá cho khách này” để bắt đầu.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
