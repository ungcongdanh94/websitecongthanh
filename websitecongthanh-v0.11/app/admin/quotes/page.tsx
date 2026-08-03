import Link from "next/link";
import { prisma } from "@/lib/prisma";
import QuoteStatusSelect from "@/components/admin/QuoteStatusSelect";
import CreateQuoteButton from "@/components/admin/CreateQuoteButton";

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
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Khách hàng</div>
          <h1 className="mt-3 text-4xl font-black">Báo giá</h1>
          <p className="mt-3 text-slate-600">Soạn, theo dõi và in báo giá cho khách hàng.</p>
        </div>
        <CreateQuoteButton />
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4">Mã báo giá</th>
                <th className="px-5 py-4">Khách hàng</th>
                <th className="px-5 py-4">Sản phẩm</th>
                <th className="px-5 py-4 text-right">Tổng tiền</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Ngày tạo</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className="border-t">
                  <td className="px-5 py-4 font-bold text-brand-800">{quote.quoteNumber || "Yêu cầu web"}</td>
                  <td className="px-5 py-4"><div className="font-semibold">{quote.customerName}</div><div className="text-xs text-slate-500">{quote.phone}</div></td>
                  <td className="px-5 py-4">{quote.items.length}</td>
                  <td className="px-5 py-4 text-right font-bold">{Number(quote.total).toLocaleString("vi-VN")} đ</td>
                  <td className="px-5 py-4"><QuoteStatusSelect quoteId={quote.id} status={quote.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{quote.createdAt.toLocaleDateString("vi-VN")}</td>
                  <td className="px-5 py-4 text-right"><Link href={`/admin/quotes/${quote.id}`} className="font-bold text-brand-700">Mở →</Link></td>
                </tr>
              ))}
              {!quotes.length && <tr><td colSpan={7} className="p-10 text-center text-slate-500">Chưa có báo giá.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
