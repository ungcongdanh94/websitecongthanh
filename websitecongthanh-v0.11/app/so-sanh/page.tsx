import { products } from "@/data/products";

export default function ComparePage() {
  const selected = products.slice(0, 3);
  return (
    <section className="container-page py-16">
      <div className="max-w-3xl">
        <div className="text-sm font-bold uppercase tracking-widest text-brand-700">So sánh sản phẩm</div>
        <h1 className="section-title mt-3">So sánh nhanh trước khi lựa chọn</h1>
      </div>
      <div className="mt-10 overflow-x-auto rounded-3xl border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="bg-brand-800 text-white">
              <th className="p-4">Tiêu chí</th>
              {selected.map((p) => <th key={p.slug} className="p-4">{p.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {[
              ["Thương hiệu", selected.map(p => p.brand)],
              ["Nhóm sản phẩm", selected.map(p => p.category)],
              ["Giá tham khảo", selected.map(p => `${p.price.toLocaleString("vi-VN")} đ/${p.unit}`)],
              ["Ứng dụng", selected.map(p => p.specs["Ứng dụng"] || "Theo cấu hình")]
            ].map(([label, values]) => (
              <tr key={String(label)} className="border-t border-slate-100">
                <td className="p-4 font-bold">{String(label)}</td>
                {(values as string[]).map((v, i) => <td key={i} className="p-4">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
