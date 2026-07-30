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
  ShieldCheck,
  Sparkles
} from "lucide-react";
import DatabaseProductCard from "@/components/DatabaseProductCard";
import { prisma } from "@/lib/prisma";
import type { PublicProduct } from "@/types/product";

export const dynamic = "force-dynamic";

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
  const rows = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true, brand: true },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 6
  });

  const featured: PublicProduct[] = rows.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDesc: product.shortDesc,
    description: product.description,
    imageUrl: product.imageUrl,
    price: product.price === null ? null : Number(product.price),
    unit: product.unit,
    specs:
      product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
        ? (product.specs as Record<string, unknown>)
        : null,
    categoryName: product.category.name,
    brandName: product.brand?.name || null
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=88"
            alt=""
            fill
            priority
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,.98)_0%,rgba(2,6,23,.88)_43%,rgba(2,6,23,.35)_100%)]" />
          <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
        </div>

        <div className="container-page relative grid min-h-[760px] items-center py-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-brand-100 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-brand-300" />
              Nhôm · Phụ kiện · Nội thất nhôm
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Giải pháp nhôm hiện đại cho
              <span className="block text-brand-300">công trình khác biệt.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              CÔNG THẢNH giúp khách hàng tra cứu sản phẩm, tham khảo giá và nhận tư vấn
              cấu hình nhôm – phụ kiện nhanh hơn trên một nền tảng thống nhất.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/san-pham" className="btn-primary bg-brand-500 px-6 hover:bg-brand-400">
                Khám phá sản phẩm
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/lien-he"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-xl transition hover:bg-white/20"
              >
                Nhận báo giá
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3 border-t border-white/10 pt-7">
              <div>
                <div className="text-2xl font-black">20+</div>
                <div className="mt-1 text-xs text-slate-400">Năm hoạt động</div>
              </div>
              <div>
                <div className="text-2xl font-black">3 nhóm</div>
                <div className="mt-1 text-xs text-slate-400">Giải pháp chính</div>
              </div>
              <div>
                <div className="text-2xl font-black">1 nền tảng</div>
                <div className="mt-1 text-xs text-slate-400">Tra cứu và báo giá</div>
              </div>
            </div>
          </div>

          <div className="hidden justify-end lg:flex">
            <div className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-2xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-6">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-300">
                  CÔNG THẢNH Platform
                </div>
                <h2 className="mt-4 text-3xl font-black">
                  Từ sản phẩm đến báo giá trong vài bước.
                </h2>
                <div className="mt-6 grid gap-3">
                  {["Chọn sản phẩm", "So sánh cấu hình", "Gửi yêu cầu báo giá"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 font-black">
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
      </section>

      <section className="container-page relative z-10 -mt-10">
        <div className="grid gap-3 rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur-xl md:grid-cols-2 xl:grid-cols-4">
          {strengths.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl p-4">
              <Icon className="h-7 w-7 text-brand-700" />
              <h2 className="mt-3 font-extrabold text-slate-950">{title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-24">
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
          {solutions.map(({ icon: Icon, eyebrow, title, text, href }, index) => (
            <Link
              key={title}
              href={href}
              className={`group rounded-[2rem] border p-7 transition hover:-translate-y-1 hover:shadow-soft ${
                index === 0
                  ? "border-brand-700 bg-brand-800 text-white"
                  : "border-slate-200 bg-white text-slate-950"
              }`}
            >
              <Icon className={`h-9 w-9 ${index === 0 ? "text-brand-300" : "text-brand-700"}`} />
              <div
                className={`mt-7 text-xs font-bold uppercase tracking-[0.18em] ${
                  index === 0 ? "text-brand-200" : "text-brand-700"
                }`}
              >
                {eyebrow}
              </div>
              <h3 className="mt-3 text-2xl font-black">{title}</h3>
              <p className={`mt-3 leading-7 ${index === 0 ? "text-brand-50/80" : "text-slate-600"}`}>
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

      <section className="border-y border-slate-200 bg-white py-24">
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

      <section className="container-page py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-900 px-7 py-14 text-white sm:px-10 lg:px-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <div className="text-sm font-bold uppercase tracking-[0.18em] text-brand-300">
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
