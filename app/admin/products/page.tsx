import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

const statusLabel = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Công khai",
  ARCHIVED: "Lưu trữ"
} as const;

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  const products = await prisma.product.findMany({
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

  return (
    <main className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">CMS</div>
          <h1 className="mt-3 text-4xl font-black">Sản phẩm</h1>
          <p className="mt-3 text-slate-600">Quản lý nhôm thanh, phụ kiện và nội thất nhôm.</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">Thêm sản phẩm</Link>
      </div>

      <form className="mt-6 max-w-2xl">
        <input
          name="q"
          defaultValue={q}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
          placeholder="Tìm tên, SKU, hệ nhôm hoặc dòng sản phẩm..."
        />
      </form>

      <div className="mt-6 overflow-hidden rounded-3xl border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[1150px] w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4">Tên</th>
                <th className="px-5 py-4">Hệ / dòng</th>
                <th className="px-5 py-4">Thương hiệu</th>
                <th className="px-5 py-4">Quy cách</th>
                <th className="px-5 py-4">Giá bán</th>
                <th className="px-5 py-4">Giá đại lý</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t align-top">
                  <td className="px-5 py-4">
                    <div className="font-semibold">{product.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{product.sku || product.category.name}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div>{product.aluminumSystem || "—"}</div>
                    <div className="mt-1 text-xs text-slate-500">{product.productLine || "—"}</div>
                  </td>
                  <td className="px-5 py-4">{product.brand?.name || "—"}</td>
                  <td className="px-5 py-4">
                    <div>{product.thickness || "—"}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {product.stockLength || "—"}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {product.price ? Number(product.price).toLocaleString("vi-VN") : "Liên hệ"}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {product.dealerPrice ? Number(product.dealerPrice).toLocaleString("vi-VN") : "—"}
                  </td>
                  <td className="px-5 py-4">{statusLabel[product.status]}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${product.id}`} className="font-semibold text-brand-700">Sửa</Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
              {!products.length && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-500">Không tìm thấy sản phẩm.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
