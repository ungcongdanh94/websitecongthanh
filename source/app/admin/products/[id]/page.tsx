import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductEditForm from "@/components/admin/ProductEditForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } })
  ]);

  if (!product) notFound();

  return (
    <main className="container-page py-12">
      <div className="max-w-3xl">
        <div className="text-sm font-bold uppercase tracking-widest text-brand-700">Sản phẩm</div>
        <h1 className="mt-3 text-4xl font-black">Chỉnh sửa sản phẩm</h1>
        <div className="mt-8">
          <ProductEditForm
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              sku: product.sku,
              shortDesc: product.shortDesc,
              description: product.description,
              imageUrl: product.imageUrl,
              price: product.price === null ? null : Number(product.price),
              unit: product.unit,
              status: product.status,
              categoryId: product.categoryId,
              brandId: product.brandId,
              isFeatured: product.isFeatured
            }}
            categories={categories}
            brands={brands}
          />
        </div>
      </div>
    </main>
  );
}
