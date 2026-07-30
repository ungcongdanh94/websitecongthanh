import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
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
      <div className="mt-8 overflow-hidden rounded-3xl border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4">Tên</th>
                <th className="px-5 py-4">Danh mục</th>
                <th className="px-5 py-4">Thương hiệu</th>
                <th className="px-5 py-4">Giá</th>
                <th className="px-5 py-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-5 py-4 font-semibold">{product.name}</td>
                  <td className="px-5 py-4">{product.category.name}</td>
                  <td className="px-5 py-4">{product.brand?.name || "—"}</td>
                  <td className="px-5 py-4">{product.price ? Number(product.price).toLocaleString("vi-VN") : "Liên hệ"}</td>
                  <td className="px-5 py-4">{product.status}</td>
                </tr>
              ))}
              {!products.length && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">Chưa có sản phẩm.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
