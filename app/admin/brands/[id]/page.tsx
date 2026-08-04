import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EntityEditForm from "@/components/admin/EntityEditForm";
import EntityDeleteButton from "@/components/admin/EntityDeleteButton";

export const dynamic = "force-dynamic";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) notFound();

  return (
    <main className="container-page py-12">
      <Link href="/admin/brands" className="text-sm font-bold text-brand-700">← Thương hiệu</Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">CMS</div>
          <h1 className="mt-3 text-4xl font-black">Sửa thương hiệu</h1>
        </div>
        <EntityDeleteButton endpoint="/api/admin/brands" id={brand.id} name={brand.name} redirectTo="/admin/brands" />
      </div>

      <div className="mt-8 max-w-2xl">
        <EntityEditForm
          endpoint="/api/admin/brands"
          label="Thương hiệu"
          entity={{
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            description: brand.description,
            isActive: brand.isActive
          }}
        />
      </div>
    </main>
  );
}
