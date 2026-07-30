import DatabaseProductCard from "@/components/DatabaseProductCard";
import { prisma } from "@/lib/prisma";
import type { PublicProduct } from "@/types/product";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const rows = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true, brand: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }]
  });

  const products: PublicProduct[] = rows.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDesc: product.shortDesc,
    description: product.description,
    imageUrl: product.imageUrl,
    price: product.price === null ? null : Number(product.price),
    unit: product.unit,
    specs:
      product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
        ? (product.specs as Record<string, unknown>)
        : null,
    categoryName: product.category.name,
    brandName: product.brand?.name || null
  }));

  return (
    <section className="container-page py-16">
      <div className="max-w-3xl">
        <div className="text-sm font-bold uppercase tracking-widest text-brand-700">
          Danh mục sản phẩm
        </div>
        <h1 className="section-title mt-3">
          Sản phẩm được quản lý trực tiếp từ CMS
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Các sản phẩm ở trạng thái công khai trong trang quản trị sẽ tự động xuất hiện tại đây.
        </p>
      </div>

      {products.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <DatabaseProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-bold">Chưa có sản phẩm công khai</h2>
          <p className="mt-2 text-slate-600">
            Vào CMS, thêm sản phẩm và chọn trạng thái “Công khai”.
          </p>
        </div>
      )}
    </section>
  );
}
