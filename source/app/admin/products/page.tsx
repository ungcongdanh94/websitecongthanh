import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

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
            { slug: { contains: q, mode: "insensitive" } }
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
          <div className="text-sm font-bold uppercase tracking-widest text-brand-700">CMS</div>
          <h1 className="mt-3 text-4xl font-black">Sản phẩm</h1>
        </div>
        <Link href="/admin/products/new" className="btn-primary">Thêm sản phẩm</Link>
      </div>

      <form className="mt-6 max-w-xl">
        <input
          name="q"
          defaultValue={q}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
          placeholder="Tìm theo tên, mã hoặc slug..."
        />
      </form>

      <div className="mt-6 overflow-hidden rounded-3xl border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4">Tên</th>
                <th className="px-5 py-4">Danh mục</th>
                <th className="px-5 py-4">Thương hiệu</th>
                <th className="px-5 py-4">Giá</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-5 py-4 font-semibold">{product.name}</td>
                  <td className="px-5 py-4">{product.category.name}</td>
                  <td className="px-5 py-4">{product.brand?.name || "—"}</td>
                  <td className="px-5 py-4">
                    {product.price ? Number(product.price).toLocaleString("vi-VN") : "Liên hệ"}
                  </td>
                  <td className="px-5 py-4">
                    {product.status === "PUBLISHED" ? "Công khai" : "Bản nháp"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${product.id}`} className="font-semibold text-brand-700">
                        Sửa
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              ))}
              {!products.length && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                    Không tìm thấy sản phẩm.
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
