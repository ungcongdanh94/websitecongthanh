import ProductForm from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } })
  ]);

  return (
    <main className="container-page py-12">
      <div className="max-w-3xl">
        <div className="text-sm font-bold uppercase tracking-widest text-brand-700">Sản phẩm</div>
        <h1 className="mt-3 text-4xl font-black">Thêm sản phẩm mới</h1>
        <div className="mt-8">
          <ProductForm categories={categories} brands={brands} />
        </div>
      </div>
    </main>
  );
}
