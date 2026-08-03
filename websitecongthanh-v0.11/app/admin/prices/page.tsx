import { prisma } from "@/lib/prisma";
import PriceManager from "@/components/admin/PriceManager";

export const dynamic = "force-dynamic";

export default async function AdminPricesPage() {
  const products = await prisma.product.findMany({
    include: { category: true, brand: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }]
  });

  const history = await prisma.priceChange.findMany({
    include: { product: { select: { name: true, sku: true } } },
    orderBy: { effectiveAt: "desc" },
    take: 12
  });

  return (
    <main className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">CMS</div>
          <h1 className="mt-3 text-4xl font-black">Quản lý bảng giá</h1>
          <p className="mt-3 text-slate-600">Cập nhật giá bán và giá đại lý hàng loạt, có lưu lịch sử.</p>
        </div>
      </div>

      <div className="mt-8">
        <PriceManager products={products.map((product) => ({
          id: product.id,
          name: product.name,
          sku: product.sku,
          unit: product.unit,
          categoryName: product.category.name,
          brandName: product.brand?.name || null,
          price: product.price === null ? null : Number(product.price),
          dealerPrice: product.dealerPrice === null ? null : Number(product.dealerPrice)
        }))} />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-black">Lịch sử thay đổi gần đây</h2>
        <div className="mt-5 overflow-hidden rounded-3xl border bg-white">
          {history.map((item) => (
            <div key={item.id} className="grid gap-3 border-b px-5 py-4 last:border-0 md:grid-cols-[1fr_auto]">
              <div>
                <div className="font-bold">{item.product.name}</div>
                <div className="mt-1 text-sm text-slate-500">{item.product.sku || "Không có SKU"} · {item.note || "Không có ghi chú"}</div>
              </div>
              <div className="text-sm text-slate-600 md:text-right">
                <div>Giá bán: {item.oldPrice === null ? "—" : Number(item.oldPrice).toLocaleString("vi-VN")} → {item.newPrice === null ? "—" : Number(item.newPrice).toLocaleString("vi-VN")}</div>
                <div>Đại lý: {item.oldDealerPrice === null ? "—" : Number(item.oldDealerPrice).toLocaleString("vi-VN")} → {item.newDealerPrice === null ? "—" : Number(item.newDealerPrice).toLocaleString("vi-VN")}</div>
                <div className="mt-1 text-xs text-slate-400">{item.effectiveAt.toLocaleString("vi-VN")}</div>
              </div>
            </div>
          ))}
          {!history.length && <div className="p-10 text-center text-slate-500">Chưa có lịch sử thay đổi giá.</div>}
        </div>
      </section>
    </main>
  );
}
