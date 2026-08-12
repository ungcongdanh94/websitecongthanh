import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Calculator,
  ChevronRight,
  Headphones,
  Layers3,
  MapPin,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import DatabaseProductCard from "@/components/DatabaseProductCard";
import { prisma } from "@/lib/prisma";
import type { PublicProduct } from "@/types/product";
import assetsV2 from "@/data/assets-v2.json";
import { normalizeLogoUrl } from "@/lib/cloudinaryUrl";

export const dynamic = "force-dynamic";

const spaceSolutionLabels: Record<string, string> = {
  "biet-thu": "Biệt thự",
  "nha-pho": "Nhà phố",
  "can-ho": "Căn hộ",
  "van-phong": "Văn phòng",
  "khach-san": "Khách sạn",
  resort: "Resort"
};

const spaceSolutions = assetsV2.solutions.map((item) => ({
  slug: item.slug,
  image: item.image,
  title: spaceSolutionLabels[item.slug] || item.slug
}));

const strengths = [
  {
    icon: BadgeCheck,
    title: "Sản phẩm chính hãng",
    text: "Danh mục nhôm và phụ kiện từ các thương hiệu uy tín."
  },
  {
    icon: Calculator,
    title: "Báo giá nhanh",
    text: "Tra cứu sản phẩm và gửi nhu cầu trực tiếp trên website."
  },
  {
    icon: ShieldCheck,
    title: "Giải pháp đồng bộ",
    text: "Tư vấn nhôm, phụ kiện và cấu hình phù hợp từng công trình."
  },
  {
    icon: Headphones,
    title: "Hỗ trợ thực tế",
    text: "Đội ngũ CÔNG THẢNH hỗ trợ xưởng, đại lý và khách hàng."
  }
];

const solutions = [
  {
    icon: Layers3,
    eyebrow: "Nhôm thanh",
    title: "Hệ nhôm cho cửa và công trình",
    text: "Tìm nhanh hệ nhôm phù hợp theo thương hiệu, ứng dụng và quy cách.",
    href: "/san-pham"
  },
  {
    icon: Boxes,
    eyebrow: "Phụ kiện",
    title: "Phụ kiện cửa đồng bộ",
    text: "Cấu hình phụ kiện theo kiểu mở, hệ nhôm và nhu cầu sử dụng.",
    href: "/san-pham"
  },
  {
    icon: Sparkles,
    eyebrow: "Nội thất nhôm",
    title: "Tủ bếp và tủ nội thất cao cấp",
    text: "Giải pháp thiết kế theo kích thước thực tế, bền và hiện đại.",
    href: "/san-pham"
  }
];

export default async function HomePage() {
  const [productRows, categories, brands, projects, banners] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      include: { category: true, brand: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 6
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 6
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      take: 8
    }),
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 4
    }),
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" }
    })
  ]);

  const featured: PublicProduct[] = productRows.map((product) => ({
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

  return (
    <>
      {/* HERO */}
      <section className="pt-6">
        <div className="container-page">
          <div className="relative min-h-[650px] overflow-hidden rounded-[2rem] bg-brand-950 text-white lg:min-h-[720px]">
            <Image
              src="/assets/hero/hero-home-mobile.webp"
              alt="Công trình sử dụng giải pháp nhôm CÔNG THẢNH"
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover lg:hidden"
            />
            <Image
              src="/assets/hero/hero-home-desktop.webp"
              alt="Công trình sử dụng giải pháp nhôm CÔNG THẢNH"
              fill
              priority
              quality={90}
              sizes="100vw"
              className="hidden object-cover lg:block"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />

            <div className="relative flex h-full min-h-[650px] flex-col justify-center gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:min-h-[720px] lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-20">
              <div className="w-full max-w-[680px]">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-100 backdrop-blur-xl">
                  <Sparkles className="h-4 w-4 text-brand-300" />
                  Xingfa · Namsung · Draho · Candy — chính hãng
                </div>

                <h1 className="mt-6 text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-[42px] lg:text-[60px]">
                  Nhôm cao cấp
                  <span className="block text-brand-300">bền vững cùng thời gian</span>
                </h1>

                <p className="mt-6 text-base leading-7 text-white/85 sm:text-lg">
                  CÔNG THẢNH cung cấp giải pháp nhôm toàn diện cho cửa đi, cửa sổ, vách kính,
                  tủ bếp, lan can, hàng rào và nội thất cao cấp.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/lien-he" className="btn-primary bg-brand-500 px-6 hover:bg-brand-400">
                    Nhận báo giá ngay
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    href="/san-pham"
                    className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-xl transition hover:bg-white/20"
                  >
                    Xem sản phẩm
                  </Link>
                </div>
              </div>

              <div className="w-full max-w-[460px] shrink-0 lg:w-[38%]">
                <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-200">
                    Quy trình đặt hàng
                  </div>
                  <div className="mt-5 grid gap-3">
                    {["Chọn sản phẩm", "So sánh cấu hình", "Gửi yêu cầu báo giá"].map(
                      (item, index) => (
                        <div
                          key={item}
                          className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500 font-black">
                            {index + 1}
                          </span>
                          <span className="font-bold">{item}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS — overlapping card */}
        <div className="container-page relative z-10 -mt-9">
          <div className="grid gap-3 rounded-[1.75rem] border border-brand-100 bg-white p-4 shadow-soft sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["15+", "Năm kinh nghiệm"],
              ["50+", "Đại lý — đối tác"],
              ["3.000+", "Công trình"],
              ["10.000+", "Khách hàng tin dùng"]
            ].map(([num, label]) => (
              <div key={label} className="flex items-center gap-3 px-3 py-2 sm:justify-center">
                <div className="text-2xl font-black text-brand-800">{num}</div>
                <div className="text-xs leading-4 text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANNERS */}
      {banners.length > 0 && (
        <section className="container-page py-10">
          <div className="grid gap-5 lg:grid-cols-2">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="group relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-brand-900 text-white"
              >
                {banner.imageUrl && (
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover opacity-60 transition duration-500 group-hover:scale-105"
                  />
                )}
                <div className="relative z-10 flex min-h-[180px] flex-col justify-center gap-3 p-8">
                  <h3 className="text-2xl font-black">{banner.title}</h3>
                  {banner.subtitle && <p className="max-w-md text-sm text-brand-50/85">{banner.subtitle}</p>}
                  {banner.buttonLabel && banner.buttonUrl && (
                    <Link href={banner.buttonUrl} className="btn-primary mt-2 w-fit bg-white text-brand-900 hover:bg-brand-50">
                      {banner.buttonLabel}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STRENGTHS STRIP */}
      <section className="container-page py-16">
        <div className="max-w-2xl">
          <div className="eyebrow">Vì sao chọn CÔNG THẢNH</div>
          <h2 className="section-title mt-3">Bốn lý do khách hàng tin chọn.</h2>
        </div>
        <div className="mt-8 grid gap-3 rounded-[2rem] border border-slate-100 bg-white p-4 shadow-soft md:grid-cols-2 xl:grid-cols-4">
          {strengths.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl p-4">
              <Icon className="h-7 w-7 text-brand-700" />
              <h2 className="mt-3 font-extrabold text-slate-950">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="container-page py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="eyebrow">Danh mục</div>
              <h2 className="section-title mt-3">Danh mục nổi bật</h2>
            </div>
            <Link href="/san-pham" className="btn-secondary">
              Xem tất cả danh mục
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/san-pham?category=${category.slug}`}
                className="group overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-soft"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-brand-700">
                      <Layers3 className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="p-5 text-center">
                  <h4 className="text-base font-bold text-slate-900">{category.name}</h4>
                  <span className="mt-1 inline-block text-xs font-bold text-brand-700">
                    Xem ngay →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SOLUTIONS */}
      <section className="container-page py-16">
        <div className="max-w-3xl">
          <div className="eyebrow">Giải pháp nổi bật</div>
          <h2 className="section-title mt-3">
            Một hệ sinh thái sản phẩm dành cho ngành nhôm.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Từ nhôm thanh, phụ kiện cửa đến nội thất nhôm cao cấp — tất cả được tổ chức
            rõ ràng để khách hàng dễ tham khảo và ra quyết định.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {solutions.map(({ icon: Icon, eyebrow, title, text, href }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-[2rem] border border-slate-200 bg-white p-7 text-slate-950 transition hover:-translate-y-1 hover:border-brand-700 hover:bg-brand-800 hover:text-white hover:shadow-soft"
            >
              <Icon className="h-9 w-9 text-brand-700 transition group-hover:text-brand-300" />
              <div className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 transition group-hover:text-brand-200">
                {eyebrow}
              </div>
              <h3 className="mt-3 text-2xl font-black">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600 transition group-hover:text-brand-50/80">
                {text}
              </p>
              <div className="mt-7 inline-flex items-center gap-2 font-bold">
                Xem giải pháp
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SPACE SOLUTIONS */}
      <section className="container-page py-16">
        <div className="max-w-2xl">
          <div className="eyebrow">Giải pháp theo không gian</div>
          <h2 className="section-title mt-3">Phù hợp với từng loại công trình.</h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {spaceSolutions.map((item) => (
            <div
              key={item.slug}
              className="group overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section className="border-y border-slate-100 bg-white py-16">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="eyebrow">Công trình</div>
                <h2 className="section-title mt-3">Dự án tiêu biểu</h2>
              </div>
              <Link href="/du-an" className="btn-secondary">
                Xem tất cả dự án
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/du-an/${project.slug}`}
                  className="group overflow-hidden rounded-[1.75rem] border border-slate-100 bg-slate-50 transition hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="relative aspect-[4/5] bg-brand-900">
                    {project.coverUrl ? (
                      <Image
                        src={project.coverUrl}
                        alt={project.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-brand-200">
                        <Layers3 className="h-8 w-8" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                        {project.location && (
                          <>
                            <MapPin className="h-3.5 w-3.5" />
                            {project.location}
                          </>
                        )}
                      </div>
                      <div className="mt-1 text-sm font-black text-white">{project.title}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CMS PRODUCTS */}
      <section className="py-16">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="eyebrow">Sản phẩm từ CMS</div>
              <h2 className="section-title mt-3">Sản phẩm đang được quan tâm.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Danh sách bên dưới được đồng bộ trực tiếp từ hệ thống quản trị.
              </p>
            </div>
            <Link href="/san-pham" className="btn-secondary">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {featured.length ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {featured.map((product) => (
                <DatabaseProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[2rem] border border-dashed border-slate-300 p-10 text-center text-slate-600">
              Chưa có sản phẩm công khai trong CMS.
            </div>
          )}
        </div>
      </section>

      {/* BRANDS */}
      {brands.length > 0 && (
        <section className="container-page py-16">
          <div className="eyebrow">Đối tác</div>
          <h2 className="section-title mt-3">Đối tác &amp; thương hiệu</h2>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex aspect-[3/2] items-center justify-center rounded-2xl border border-slate-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
              >
                {brand.logoUrl ? (
                  <div className="relative h-full w-full">
                    <Image src={normalizeLogoUrl(brand.logoUrl)} alt={brand.name} fill className="object-contain" />
                  </div>
                ) : (
                  <span className="text-sm font-black uppercase tracking-wide text-slate-600">
                    {brand.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-900 px-7 py-14 text-white sm:px-10 lg:px-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-brand-200">
                Ưu đãi lắp đặt đang áp dụng theo khu vực — hỏi trực tiếp khi gửi yêu cầu
              </div>
              <div className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-brand-300">
                Cần báo giá nhanh?
              </div>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                Gửi nhu cầu, CÔNG THẢNH sẽ tư vấn cấu hình phù hợp.
              </h2>
              <p className="mt-5 text-lg leading-8 text-brand-50/75">
                Chỉ cần mô tả sản phẩm, số lượng hoặc loại công trình. Yêu cầu sẽ được
                lưu trực tiếp vào hệ thống quản trị.
              </p>
            </div>
            <Link
              href="/lien-he"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 font-black text-brand-900 transition hover:bg-brand-50"
            >
              Gửi yêu cầu ngay
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
