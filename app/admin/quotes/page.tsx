import { prisma } from "@/lib/prisma";
import QuoteStatusSelect from "@/components/admin/QuoteStatusSelect";

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="container-page py-12">
      <div>
        <div className="text-sm font-bold uppercase tracking-widest text-brand-700">Khách hàng</div>
        <h1 className="mt-3 text-4xl font-black">Yêu cầu báo giá</h1>
      </div>

      <div className="mt-8 grid gap-5">
        {quotes.map((quote) => (
          <article key={quote.id} className="rounded-3xl border bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">{quote.customerName}</h2>
                <p className="mt-1 text-slate-600">
                  {quote.phone} {quote.email ? `· ${quote.email}` : ""}
                </p>
              </div>
              <QuoteStatusSelect quoteId={quote.id} status={quote.status} />
            </div>
            {quote.company && <p className="mt-4"><b>Công ty/xưởng:</b> {quote.company}</p>}
            {quote.note && <p className="mt-3 text-slate-700">{quote.note}</p>}
            {!!quote.items.length && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                {quote.items.map((item) => (
                  <div key={item.id}>
                    {item.productName} {item.quantity ? `— ${Number(item.quantity)} ${item.unit || ""}` : ""}
                  </div>
                ))}
              </div>
            )}
            <p className="mt-4 text-xs text-slate-400">{quote.createdAt.toLocaleString("vi-VN")}</p>
          </article>
        ))}
        {!quotes.length && (
          <div className="rounded-3xl border bg-white p-10 text-center text-slate-500">
            Chưa có yêu cầu báo giá.
          </div>
        )}
      </div>
    </main>
  );
}
