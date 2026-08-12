import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductTable from "@/components/admin/ProductTable";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  const rows = await prisma.product.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { aluminumSystem: { contains: q, mode: "insensitive" } },
            { productLine: { contains: q, mode: "insensitive" } }
          ]
        }
      : undefined,
    include: { category: true, brand: true },
    orderBy: { createdAt: "desc" }
  });

  const products = rows.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    categoryName: product.category.name,
    aluminumSystem: product.aluminumSystem,
    productLine: product.productLine,
    brandName: product.brand?.name || null,
    thickness: product.thickness,
    stockLength: product.stockLength,
    price: product.price === null ? null : Number(product.price),
    dealerPrice: product.dealerPrice === null ? null : Number(product.dealerPrice),
    status: product.status
  }));

  return (
    <main className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">CMS</div>
          <h1 className="mt-3 text-4xl font-black">Sản phẩm</h1>
          <p className="mt-3 text-slate-600">Quản lý nhôm thanh, phụ kiện và nội thất nhôm.</p>
        </div>
        <div className="flex gap-3">
          <a href="/api/admin/products/export" className="btn-secondary">Xuất Excel</a>
          <Link href="/admin/products/new" className="btn-primary">Thêm sản phẩm</Link>
        </div>
      </div>

      <form className="mt-6 max-w-2xl">
        <input
          name="q"
          defaultValue={q}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
          placeholder="Tìm tên, SKU, hệ nhôm hoặc dòng sản phẩm..."
        />
      </form>

      <div className="mt-6">
        <ProductTable products={products} />
      </div>
    </main>
  );
}
