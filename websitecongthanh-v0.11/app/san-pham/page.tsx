import DatabaseProductCard from "@/components/DatabaseProductCard";
import { prisma } from "@/lib/prisma";
import type { PublicProduct } from "@/types/product";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; brand?: string; system?: string }>;
}) {
  const { q = "", category = "", brand = "", system = "" } = await searchParams;

  const [rows, categories, brands, systems] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        ...(q ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
            { productLine: { contains: q, mode: "insensitive" } },
            { aluminumSystem: { contains: q, mode: "insensitive" } }
          ]
        } : {}),
        ...(category ? { category: { slug: category } } : {}),
        ...(brand ? { brand: { slug: brand } } : {}),
        ...(system ? { aluminumSystem: system } : {})
      },
      include: { category: true, brand: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }]
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", aluminumSystem: { not: null } },
      select: { aluminumSystem: true },
      distinct: ["aluminumSystem"],
      orderBy: { aluminumSystem: "asc" }
    })
  ]);

  const products: PublicProduct[] = rows.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDesc: product.shortDesc,
    description: product.description,
    imageUrl: product.imageUrl,
    price: product.price === null ? null : Number(product.price),
    unit: product.unit,
    productLine: product.productLine,
    aluminumSystem: product.aluminumSystem,
    color: product.color,
    thickness: product.thickness === null ? null : Number(product.thickness),
    stockLength: product.stockLength,
    catalogUrl: product.catalogUrl,
    videoUrl: product.videoUrl,
    specs: product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
      ? (product.specs as Record<string, unknown>)
      : null,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    brandName: product.brand?.name || null,
    brandSlug: product.brand?.slug || null
  }));

  const field = "rounded-2xl border border-slate-200 bg-white px-4 py-3";

  return (
    <section className="container-page py-16">
      <div className="max-w-3xl">
        <div className="eyebrow">Danh mục sản phẩm</div>
        <h1 className="section-title mt-3">Tra cứu sản phẩm theo đúng nhu cầu.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Lọc theo danh mục, thương hiệu và hệ nhôm để tìm nhanh sản phẩm phù hợp.
        </p>
      </div>

      <form className="mt-8 grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 md:grid-cols-2 xl:grid-cols-5">
        <input name="q" defaultValue={q} className={field} placeholder="Tên, mã hoặc hệ nhôm..." />
        <select name="category" defaultValue={category} className={field}>
          <option value="">Tất cả danh mục</option>
          {categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
        </select>
        <select name="brand" defaultValue={brand} className={field}>
          <option value="">Tất cả thương hiệu</option>
          {brands.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
        </select>
        <select name="system" defaultValue={system} className={field}>
          <option value="">Tất cả hệ nhôm</option>
          {systems.map((item) => item.aluminumSystem && (
            <option key={item.aluminumSystem} value={item.aluminumSystem}>{item.aluminumSystem}</option>
          ))}
        </select>
        <button className="btn-primary">Lọc sản phẩm</button>
      </form>

      <div className="mt-6 text-sm font-semibold text-slate-500">
        Tìm thấy {products.length} sản phẩm
      </div>

      {products.length ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => <DatabaseProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-bold">Không tìm thấy sản phẩm phù hợp</h2>
          <p className="mt-2 text-slate-600">Hãy thay đổi bộ lọc hoặc liên hệ CÔNG THẢNH để được tư vấn.</p>
        </div>
      )}
    </section>
  );
}
