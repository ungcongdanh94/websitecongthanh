import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bảng giá nhôm và phụ kiện | CÔNG THẢNH",
  description: "Bảng giá tham khảo nhôm thanh, phụ kiện cửa và nội thất nhôm. Liên hệ CÔNG THẢNH để nhận báo giá theo số lượng và cấu hình."
};

export default async function PricePage() {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true, brand: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }]
  });

  return (
    <section className="container-page py-16">
      <div className="max-w-3xl">
        <div className="eyebrow">Bảng giá tham khảo</div>
        <h1 className="section-title mt-3">Giá sản phẩm rõ ràng, dễ tra cứu.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Giá trên website mang tính tham khảo và có thể thay đổi theo màu, quy cách,
          số lượng và chính sách từng thời điểm.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead className="bg-brand-900 text-white">
              <tr>
                <th className="p-5">Sản phẩm</th>
                <th className="p-5">Thương hiệu</th>
                <th className="p-5">Danh mục</th>
                <th className="p-5">Giá tham khảo</th>
                <th className="p-5"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-slate-100 transition hover:bg-brand-50/50">
                  <td className="p-5 font-bold text-slate-950">{product.name}</td>
                  <td className="p-5 text-slate-600">{product.brand?.name || "—"}</td>
                  <td className="p-5 text-slate-600">{product.category.name}</td>
                  <td className="p-5 font-black text-brand-700">
                    {product.price
                      ? `${Number(product.price).toLocaleString("vi-VN")} đ${product.unit ? `/${product.unit}` : ""}`
                      : "Liên hệ"}
                  </td>
                  <td className="p-5 text-right">
                    <Link href={`/san-pham/${product.slug}`} className="font-bold text-brand-700">
                      Chi tiết →
                    </Link>
                  </td>
                </tr>
              ))}
              {!products.length && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500">
                    Chưa có sản phẩm công khai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-amber-50 p-5 text-sm leading-6 text-amber-900">
        Giá chính thức sẽ được xác nhận sau khi CÔNG THẢNH tiếp nhận đầy đủ quy cách,
        màu sắc và số lượng.
      </div>
    </section>
  );
}
