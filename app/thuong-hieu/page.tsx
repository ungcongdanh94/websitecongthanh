import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thương hiệu phân phối | CÔNG THẢNH",
  description: "Danh sách các thương hiệu nhôm, phụ kiện và nội thất nhôm mà CÔNG THẢNH đang phân phối chính hãng."
};

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" }
  });

  return (
    <main className="container-page py-16">
      <div className="max-w-3xl">
        <div className="eyebrow">Thương hiệu</div>
        <h1 className="section-title mt-3">Thương hiệu đang phân phối chính hãng.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Mỗi thương hiệu được CÔNG THẢNH chọn lọc kỹ theo chất lượng, ứng dụng và nhu cầu thực tế của khách hàng.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/thuong-hieu/${brand.slug}`}
            className="group rounded-[1.75rem] border border-slate-100 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-soft"
          >
            <div className="flex h-16 items-center">
              {brand.logoUrl ? (
                <div className="relative h-12 w-full">
                  <Image src={brand.logoUrl} alt={brand.name} fill sizes="200px" className="object-contain object-left" />
                </div>
              ) : (
                <span className="text-xl font-black uppercase tracking-wide text-slate-800">{brand.name}</span>
              )}
            </div>
            {brand.description && (
              <p className="mt-4 text-sm leading-6 text-slate-600">{brand.description}</p>
            )}
            <div className="mt-4 text-sm font-bold text-brand-700">
              {brand._count.products} sản phẩm →
            </div>
          </Link>
        ))}
      </div>

      {!brands.length && (
        <div className="mt-10 rounded-3xl border border-dashed p-10 text-center text-slate-500">
          Chưa có thương hiệu đang hoạt động.
        </div>
      )}
    </main>
  );
}
