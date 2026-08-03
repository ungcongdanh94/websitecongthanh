import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CreateQuoteButton from "@/components/admin/CreateQuoteButton";
import QuoteStatusSelect from "@/components/admin/QuoteStatusSelect";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  NEW: "Mới",
  CONTACTED: "Đã liên hệ",
  QUOTED: "Đã báo giá",
  WON: "Thành công",
  LOST: "Không thành công"
};

export default async function QuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true }
  });

  return (
    <main className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">CMS</div>
          <h1 className="mt-3 text-4xl font-black">Báo giá</h1>
          <p className="mt-3 text-slate-600">Soạn và theo dõi báo giá gửi cho khách hàng.</p>
        </div>
        <CreateQuoteButton />
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4">Mã báo giá</th>
                <th className="px-5 py-4">Khách hàng</th>
                <th className="px-5 py-4">Số dòng</th>
                <th className="px-5 py-4">Tổng tiền</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Ngày tạo</th>
                <th className="px-5 py-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className="border-t align-top">
                  <td className="px-5 py-4 font-semibold">{quote.quoteNumber || quote.id.slice(0, 8)}</td>
                  <td className="px-5 py-4">
                    <div className="font-semibold">{quote.customerName}</div>
                    <div className="mt-1 text-xs text-slate-500">{quote.phone}</div>
                  </td>
                  <td className="px-5 py-4">{quote.items.length}</td>
                  <td className="px-5 py-4 font-semibold">{Number(quote.total).toLocaleString("vi-VN")} đ</td>
                  <td className="px-5 py-4">
                    <QuoteStatusSelect quoteId={quote.id} status={quote.status} />
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {new Date(quote.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/quotes/${quote.id}`} className="font-semibold text-brand-700">
                      Soạn báo giá
                    </Link>
                  </td>
                </tr>
              ))}
              {!quotes.length && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-500">
                    Chưa có báo giá nào. Nhấn “Tạo báo giá” để bắt đầu.
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
