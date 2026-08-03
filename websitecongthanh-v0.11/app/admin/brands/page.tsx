import { prisma } from "@/lib/prisma";
import SimpleEntityForm from "@/components/admin/SimpleEntityForm";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" }
  });

  return (
    <main className="container-page py-12">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="text-sm font-bold uppercase tracking-widest text-brand-700">CMS</div>
          <h1 className="mt-3 text-4xl font-black">Thương hiệu</h1>
          <div className="mt-8">
            <SimpleEntityForm endpoint="/api/admin/brands" label="Thương hiệu" />
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border bg-white">
          {brands.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b px-5 py-4 last:border-0">
              <div>
                <div className="font-bold">{item.name}</div>
                <div className="text-sm text-slate-500">{item.slug}</div>
              </div>
              <div className="text-sm font-semibold text-slate-500">{item._count.products} sản phẩm</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
