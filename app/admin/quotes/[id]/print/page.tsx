import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { site } from "@/data/site";
import PrintButton from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

function money(value: number) {
  return value.toLocaleString("vi-VN", { maximumFractionDigits: 0 });
}

export default async function QuotePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await prisma.quoteRequest.findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: "asc" } } }
  });
  if (!quote) notFound();

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 print:bg-white print:p-0">
      <div className="mx-auto mb-5 flex max-w-5xl justify-end print:hidden"><PrintButton /></div>
      <article className="mx-auto max-w-5xl bg-white p-10 shadow-xl print:max-w-none print:p-0 print:shadow-none">
        <header className="flex items-start justify-between gap-8 border-b-2 border-brand-800 pb-6">
          <div>
            <div className="text-3xl font-black text-brand-800">CÔNG THẢNH</div>
            <div className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{site.legalName}</div>
            <div className="mt-2 text-sm text-slate-600">{site.address}</div>
            <div className="text-sm text-slate-600">Hotline: {site.hotline} · {site.website}</div>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-black">BÁO GIÁ</h1>
            <div className="mt-2 font-bold text-brand-800">{quote.quoteNumber || quote.id}</div>
            <div className="mt-1 text-sm text-slate-500">Ngày: {quote.createdAt.toLocaleDateString("vi-VN")}</div>
            {quote.validUntil && <div className="text-sm text-slate-500">Hiệu lực đến: {quote.validUntil.toLocaleDateString("vi-VN")}</div>}
          </div>
        </header>

        <section className="mt-7 grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
          <div><b>Khách hàng:</b> {quote.customerName}</div>
          <div><b>Điện thoại:</b> {quote.phone || "—"}</div>
          <div><b>Công ty/xưởng:</b> {quote.company || "—"}</div>
          <div><b>Email:</b> {quote.email || "—"}</div>
          <div className="col-span-2"><b>Địa chỉ:</b> {quote.address || "—"}</div>
        </section>

        <table className="mt-8 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-brand-800 text-white">
              <th className="border border-brand-900 p-3 text-center">STT</th>
              <th className="border border-brand-900 p-3 text-left">Sản phẩm</th>
              <th className="border border-brand-900 p-3 text-right">SL</th>
              <th className="border border-brand-900 p-3 text-center">ĐVT</th>
              <th className="border border-brand-900 p-3 text-right">Đơn giá</th>
              <th className="border border-brand-900 p-3 text-right">CK</th>
              <th className="border border-brand-900 p-3 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, index) => (
              <tr key={item.id}>
                <td className="border p-3 text-center">{index + 1}</td>
                <td className="border p-3"><div className="font-bold">{item.productName}</div>{item.note && <div className="mt-1 text-xs text-slate-500">{item.note}</div>}</td>
                <td className="border p-3 text-right">{Number(item.quantity).toLocaleString("vi-VN")}</td>
                <td className="border p-3 text-center">{item.unit || ""}</td>
                <td className="border p-3 text-right">{money(Number(item.unitPrice))}</td>
                <td className="border p-3 text-right">{Number(item.discountRate)}%</td>
                <td className="border p-3 text-right font-bold">{money(Number(item.lineTotal))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <section className="ml-auto mt-6 w-full max-w-md text-sm">
          <div className="flex justify-between py-2"><span>Tạm tính</span><b>{money(Number(quote.subtotal))} đ</b></div>
          <div className="flex justify-between py-2"><span>Chiết khấu ({Number(quote.discountRate)}%)</span><span>-{money(Number(quote.discountValue))} đ</span></div>
          <div className="flex justify-between py-2"><span>VAT ({Number(quote.taxRate)}%)</span><span>{money(Number(quote.taxValue))} đ</span></div>
          <div className="flex justify-between border-t-2 border-brand-800 py-3 text-xl font-black text-brand-800"><span>TỔNG CỘNG</span><span>{money(Number(quote.total))} đ</span></div>
        </section>

        {quote.note && <section className="mt-8 text-sm"><b>Ghi chú:</b><p className="mt-2 whitespace-pre-line text-slate-700">{quote.note}</p></section>}
        {quote.terms && <section className="mt-6 text-sm"><b>Điều khoản:</b><p className="mt-2 whitespace-pre-line text-slate-700">{quote.terms}</p></section>}

        <footer className="mt-12 grid grid-cols-2 text-center text-sm">
          <div><div className="font-bold">KHÁCH HÀNG</div><div className="mt-1 text-slate-500">Ký và ghi rõ họ tên</div></div>
          <div><div className="font-bold">CÔNG TY CÔNG THẢNH</div><div className="mt-1 text-slate-500">Người lập báo giá</div></div>
        </footer>
      </article>
    </main>
  );
}
