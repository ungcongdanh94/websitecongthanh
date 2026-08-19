import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EntityEditForm from "@/components/admin/EntityEditForm";
import EntityDeleteButton from "@/components/admin/EntityDeleteButton";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <main className="container-page py-12">
      <Link href="/admin/categories" className="text-sm font-bold text-brand-700">← Danh mục</Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">CMS</div>
          <h1 className="mt-3 text-4xl font-black">Sửa danh mục</h1>
        </div>
        <EntityDeleteButton endpoint="/api/admin/categories" id={category.id} name={category.name} redirectTo="/admin/categories" />
      </div>

      <div className="mt-8 max-w-2xl">
        <EntityEditForm
          endpoint="/api/admin/categories"
          label="Danh mục"
          entity={{
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            isActive: category.isActive
          }}
        />
      </div>
    </main>
  );
}
