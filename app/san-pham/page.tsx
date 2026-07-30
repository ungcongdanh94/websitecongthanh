import ProductExplorer from "@/components/ProductExplorer";

export default function ProductsPage() {
  return (
    <section className="container-page py-16">
      <div className="max-w-3xl">
        <div className="text-sm font-bold uppercase tracking-widest text-brand-700">Danh mục sản phẩm</div>
        <h1 className="section-title mt-3">Tìm sản phẩm phù hợp với nhu cầu của bạn</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">Tìm kiếm theo tên, thương hiệu hoặc nhóm sản phẩm. Giá đang hiển thị là giá tham khảo.</p>
      </div>
      <div className="mt-10"><ProductExplorer /></div>
    </section>
  );
}
