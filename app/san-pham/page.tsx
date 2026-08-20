import Link from "next/link";
import type { Metadata } from "next";
import DatabaseProductCard from "@/components/DatabaseProductCard";
import ProductFilterPanel from "@/components/ProductFilterPanel";
import { prisma } from "@/lib/prisma";
import type { PublicProduct } from "@/types/product";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sản phẩm nhôm, phụ kiện, nội thất nhôm | CÔNG THẢNH",
  description:
    "Tra cứu đầy đủ sản phẩm nhôm Xingfa, Namsung, phụ kiện Draho, Candy và nội thất nhôm — lọc theo danh mục, thương hiệu, hệ nhôm và khoảng giá.",
  alternates: { canonical: "/san-pham" }
};

const PAGE_SIZE = 12;

const sortOptions = [
  { value: "moi-nhat", label: "Mới nhất" },
  { value: "gia-tang", label: "Giá thấp → cao" },
  { value: "gia-giam", label: "Giá cao → thấp" },
  { value: "ten-az", label: "Tên A → Z" }
] as const;

function buildOrderBy(sort: string): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "gia-tang":
      return [{ price: "asc" }];
    case "gia-giam":
      return [{ price: "desc" }];
    case "ten-az":
      return [{ name: "asc" }];
    default:
      return [{ isFeatured: "desc" }, { createdAt: "desc" }];
  }
}

type ProductSearchParams = Promise<{
  q?: string;
  category?: string;
  brand?: string;
  system?: string;
  color?: string;
  thickness?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
}>;

export default async function ProductsPage({
  searchParams
}: {
  searchParams: ProductSearchParams;
}) {
  const {
    q = "",
    category = "",
    brand = "",
    system = "",
    color = "",
    thickness = "",
    minPrice = "",
    maxPrice = "",
    sort = "moi-nhat",
    page: pageParam = "1"
  } = await searchParams;

  const page = Math.max(1, Number.parseInt(pageParam, 10) || 1);
  const min = minPrice ? Number(minPrice) : null;
  const max = maxPrice ? Number(maxPrice) : null;

  const where: Prisma.ProductWhereInput = {
    status: "PUBLISHED",
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
            { productLine: { contains: q, mode: "insensitive" } },
            { aluminumSystem: { contains: q, mode: "insensitive" } }
          ]
        }
      : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(brand ? { brand: { slug: brand } } : {}),
    ...(system ? { aluminumSystem: system } : {}),
    ...(color ? { color: { contains: color, mode: "insensitive" } } : {}),
    ...(thickness ? { thickness: { contains: thickness, mode: "insensitive" } } : {}),
    ...(min !== null || max !== null
      ? {
          price: {
            ...(min !== null ? { gte: min } : {}),
            ...(max !== null ? { lte: max } : {})
          }
        }
      : {})
  };

  const [rows, total, categories, brands, systems] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, brand: true },
      orderBy: buildOrderBy(sort),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    }),
    prisma.product.count({ where }),
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
    gallery: Array.isArray(product.gallery) ? (product.gallery as string[]) : [],
    price: product.price === null ? null : Number(product.price),
    unit: product.unit,
    productLine: product.productLine,
    aluminumSystem: product.aluminumSystem,
    color: product.color,
    thickness: product.thickness,
    stockLength: product.stockLength,
    catalogUrl: product.catalogUrl,
    videoUrl: product.videoUrl,
    specs:
      product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
        ? (product.specs as Record<string, unknown>)
        : null,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    brandName: product.brand?.name || null,
    brandSlug: product.brand?.slug || null
  }));

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const hasActiveFilters = Boolean(category || brand || system || color || thickness || minPrice || maxPrice);

  function pageHref(targetPage: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (system) params.set("system", system);
    if (color) params.set("color", color);
    if (thickness) params.set("thickness", thickness);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort && sort !== "moi-nhat") params.set("sort", sort);
    if (targetPage > 1) params.set("page", String(targetPage));
    const query = params.toString();
    return query ? `/san-pham?${query}` : "/san-pham";
  }

  return (
    <section className="container-page py-16">
      <div className="max-w-3xl">
        <div className="eyebrow">Danh mục sản phẩm</div>
        <h1 className="section-title mt-3">Tra cứu sản phẩm theo đúng nhu cầu.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Lọc theo danh mục, thương hiệu, hệ nhôm và khoảng giá để tìm nhanh sản phẩm phù hợp.
        </p>
      </div>

      <ProductFilterPanel
        q={q}
        category={category}
        brand={brand}
        system={system}
        color={color}
        thickness={thickness}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sort={sort}
        categories={categories.map((item) => ({ value: item.slug, label: item.name }))}
        brands={brands.map((item) => ({ value: item.slug, label: item.name }))}
        systems={systems.map((item) => item.aluminumSystem).filter((v): v is string => Boolean(v))}
        sortOptions={sortOptions}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-slate-500">
        <span>Tìm thấy {total} sản phẩm</span>
        {totalPages > 1 && <span>Trang {page} / {totalPages}</span>}
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

      {totalPages > 1 && (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <Link
            href={pageHref(Math.max(1, page - 1))}
            aria-disabled={page <= 1}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold ${page <= 1 ? "pointer-events-none opacity-40" : "hover:border-brand-500 hover:text-brand-700"}`}
          >
            ← Trước
          </Link>
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter((num) => num === 1 || num === totalPages || Math.abs(num - page) <= 1)
            .map((num, index, arr) => (
              <span key={num} className="flex items-center gap-2">
                {index > 0 && arr[index - 1] !== num - 1 && <span className="px-1 text-slate-400">…</span>}
                <Link
                  href={pageHref(num)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold ${num === page ? "border-brand-700 bg-brand-700 text-white" : "hover:border-brand-500 hover:text-brand-700"}`}
                >
                  {num}
                </Link>
              </span>
            ))}
          <Link
            href={pageHref(Math.min(totalPages, page + 1))}
            aria-disabled={page >= totalPages}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold ${page >= totalPages ? "pointer-events-none opacity-40" : "hover:border-brand-500 hover:text-brand-700"}`}
          >
            Sau →
          </Link>
        </nav>
      )}
    </section>
  );
}
