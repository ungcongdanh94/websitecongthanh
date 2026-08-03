import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QuoteBuilder from "@/components/admin/QuoteBuilder";

export const dynamic = "force-dynamic";

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [quote, products] = await Promise.all([
    prisma.quoteRequest.findUnique({
      where: { id },
      include: { items: { orderBy: { sortOrder: "asc" } } }
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { id: true, name: true, sku: true, unit: true, price: true },
      orderBy: { name: "asc" }
    })
  ]);

  if (!quote) notFound();

  return (
    <main className="container-page py-12">
      <div className="mb-8">
        <div className="eyebrow">Báo giá</div>
        <h1 className="mt-3 text-4xl font-black">Soạn báo giá</h1>
      </div>
      <QuoteBuilder
        initialQuote={{
          id: quote.id,
          quoteNumber: quote.quoteNumber || quote.id,
          customerName: quote.customerName,
          phone: quote.phone,
          email: quote.email || "",
          company: quote.company || "",
          address: quote.address || "",
          note: quote.note || "",
          terms: quote.terms || "",
          status: quote.status,
          discountRate: Number(quote.discountRate),
          taxRate: Number(quote.taxRate),
          validUntil: quote.validUntil ? quote.validUntil.toISOString().slice(0, 10) : "",
          items: quote.items.map((item) => ({
            id: item.id,
            productId: item.productId || "",
            productName: item.productName,
            quantity: Number(item.quantity),
            unit: item.unit || "",
            unitPrice: Number(item.unitPrice),
            discountRate: Number(item.discountRate),
            note: item.note || ""
          }))
        }}
        products={products.map((product) => ({ ...product, price: product.price === null ? null : Number(product.price) }))}
      />
    </main>
  );
}
