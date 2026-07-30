import Link from "next/link";
import { products } from "@/data/products";

export default function PricePage() {
  return (
    <section className="container-page py-16">
      <div className="max-w-3xl">
        <div className="text-sm font-bold uppercase tracking-widest text-brand-700">Bảng giá tham khảo</div>
        <h1 className="section-title mt-3">Giá sản phẩm rõ ràng, dễ tra cứu</h1>
        <p className="mt-4 text-slate-600">Giá chưa thay thế báo giá chính thức. Vui lòng liên hệ để xác nhận giá theo màu, quy cách và số lượng.</p>
      </div>
      <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-brand-800 text-white">
              <tr><th className="p-4">Sản phẩm</th><th className="p-4">Thương hiệu</th><th className="p-4">Nhóm</th><th className="p-4">Giá tham khảo</th><th className="p-4"></th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.slug} className="border-t border-slate-100">
                  <td className="p-4 font-bold">{p.name}</td>
                  <td className="p-4">{p.brand}</td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 font-bold text-brand-700">{p.price.toLocaleString("vi-VN")} đ/{p.unit}</td>
                  <td className="p-4"><Link href={`/san-pham/${p.slug}`} className="font-bold text-brand-700">Xem</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
