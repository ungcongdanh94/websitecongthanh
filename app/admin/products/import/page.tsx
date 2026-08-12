import Link from "next/link";
import ProductImportManager from "@/components/admin/ProductImportManager";

export const dynamic = "force-dynamic";

export default function ImportProductsPage() {
  return (
    <main className="container-page py-12">
      <Link href="/admin/products" className="text-sm font-bold text-brand-700">← Sản phẩm</Link>
      <div className="mt-4">
        <div className="eyebrow">CMS</div>
        <h1 className="mt-3 text-4xl font-black">Nhập sản phẩm từ Excel/CSV</h1>
        <p className="mt-3 text-slate-600">Xem trước và kiểm tra dữ liệu trước khi ghi vào hệ thống.</p>
      </div>

      <div className="mt-8">
        <ProductImportManager />
      </div>
    </main>
  );
}
