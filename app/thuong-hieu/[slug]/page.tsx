import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DatabaseProductCard from "@/components/DatabaseProductCard";
import type { PublicProduct } from "@/types/product";

export const dynamic = "force-dynamic";

const getBrand = cache(async (slug: string) => {
  return prisma.brand.findFirst({ where: { slug, isActive: true } });
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);

  if (!brand) return { title: "Thương hiệu không tồn tại | CÔNG THẢNH" };

  const description = brand.description || `Sản phẩm thương hiệu ${brand.name} phân phối chính hãng tại CÔNG THẢNH.`;

  return {
    title: `${brand.name} | Thương hiệu CÔNG THẢNH`,
    description,
    openGraph: { title: brand.name, description, images: brand.logoUrl ? [{ url: brand.logoUrl }] : undefined }
  };
}

export default async function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const rows = await prisma.product.findMany({
    where: { status: "PUBLISHED", brandId: brand.id },
    include: { category: true, brand: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }]
  });

  const products: PublicProduct[] = rows.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    shortDesc: item.shortDesc,
    description: item.description,
    imageUrl: item.imageUrl,
    gallery: Array.isArray(item.gallery) ? (item.gallery as string[]) : [],
    price: item.price === null ? null : Number(item.price),
    unit: item.unit,
    productLine: item.productLine,
    aluminumSystem: item.aluminumSystem,
    color: item.color,
    thickness: item.thickness,
    stockLength: item.stockLength,
    catalogUrl: item.catalogUrl,
    videoUrl: item.videoUrl,
    specs:
      item.specs && typeof item.specs === "object" && !Array.isArray(item.specs)
        ? (item.specs as Record<string, unknown>)
        : null,
    categoryName: item.category.name,
    categorySlug: item.category.slug,
    brandName: item.brand?.name || null,
    brandSlug: item.brand?.slug || null
  }));

  return (
    <main className="container-page py-16">
      <Link href="/thuong-hieu" className="inline-flex items-center gap-2 text-sm font-bold text-brand-700">
        <ArrowLeft className="h-4 w-4" /> Tất cả thương hiệu
      </Link>

      <div className="mt-6 rounded-[2rem] border border-slate-100 bg-white p-8 sm:p-10">
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex h-20 w-48 items-center">
            {brand.logoUrl ? (
              <div className="relative h-16 w-full">
                <Image src={brand.logoUrl} alt={brand.name} fill sizes="220px" className="object-contain object-left" />
              </div>
            ) : (
              <span className="text-3xl font-black uppercase tracking-wide text-slate-800">{brand.name}</span>
            )}
          </div>
          <div className="max-w-2xl">
            {brand.description && <p className="text-lg leading-8 text-slate-600">{brand.description}</p>}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="section-title">Sản phẩm {brand.name}.</h2>
        {products.length ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <DatabaseProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed p-10 text-center text-slate-500">
            Chưa có sản phẩm công khai thuộc thương hiệu này.
          </div>
        )}
      </div>
    </main>
  );
}
