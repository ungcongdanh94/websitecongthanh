import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Award,
  Building2,
  Compass,
  Handshake,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Target
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import companyContent from "@/data/company-content.json";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Giới thiệu công ty | CÔNG THẢNH",
  description:
    "CÔNG THẢNH — giải pháp nhôm đồng bộ cho công trình, đại lý và xưởng sản xuất tại An Giang. Tìm hiểu lịch sử hình thành, tầm nhìn, sứ mệnh và năng lực của công ty.",
  alternates: { canonical: "/gioi-thieu" }
};

const coreValues = [
  {
    icon: ShieldCheck,
    title: "Chính hãng",
    text: "Chỉ phân phối sản phẩm có nguồn gốc rõ ràng từ các thương hiệu uy tín."
  },
  {
    icon: HeartHandshake,
    title: "Tận tâm",
    text: "Tư vấn đúng nhu cầu, đồng hành cùng khách hàng suốt quá trình sử dụng."
  },
  {
    icon: Target,
    title: "Chính xác",
    text: "Tư vấn cấu hình và báo giá dựa trên thông số kỹ thuật thực tế."
  },
  {
    icon: Handshake,
    title: "Đồng hành lâu dài",
    text: "Hỗ trợ đại lý, xưởng sản xuất và khách hàng như một đối tác dài hạn."
  }
];

const founded = new Date(companyContent.foundedDate);
const yearsActive = new Date().getFullYear() - founded.getFullYear();

export default async function AboutPage() {
  const brands = await prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });

  return (
    <>
      {/* HERO */}
      <section className="pt-6">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-950 text-white">
            <Image
              src="/assets/hero/hero-home-desktop.webp"
              alt={companyContent.companyName}
              fill
              priority
              quality={90}
              sizes="100vw"
              className="hidden object-cover lg:block"
            />
            <Image
              src="/assets/hero/hero-home-mobile.webp"
              alt={companyContent.companyName}
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover lg:hidden"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="relative flex min-h-[420px] flex-col justify-center px-6 py-16 sm:px-10 lg:px-14">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-100 backdrop-blur-xl">
                <Sparkles className="h-4 w-4 text-brand-300" />
                Giới thiệu {companyContent.companyName}
              </div>
              <h1 className="mt-6 max-w-2xl text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-5xl">
                {companyContent.tagline}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
                {companyContent.positioning}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GIỚI THIỆU CÔNG TY */}
      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="eyebrow">Giới thiệu</div>
            <h2 className="section-title mt-3">{companyContent.legalName}</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{companyContent.positioning}</p>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="flex gap-3">
                <Building2 className="h-5 w-5 shrink-0 text-brand-700" />
                <span>{companyContent.address}</span>
              </div>
              <div className="flex gap-3">
                <Compass className="h-5 w-5 shrink-0 text-brand-700" />
                <a href={companyContent.website} className="hover:text-brand-700">{companyContent.website.replace("https://", "")}</a>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-8">
            <div className="eyebrow">Lịch sử hình thành</div>
            <h3 className="mt-3 text-2xl font-black text-slate-950">
              Hoạt động từ {founded.getFullYear()} — {yearsActive}+ năm trong ngành nhôm
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {companyContent.companyName} bắt đầu hoạt động trong lĩnh vực thương mại và sản xuất
              các sản phẩm ngành nhôm từ năm {founded.getFullYear()}, từng bước mở rộng sang gia công sơn tĩnh điện,
              gia công thành phẩm cửa nhôm và giải pháp nội thất nhôm — phục vụ khách hàng, đại lý
              và xưởng sản xuất tại An Giang và khu vực miền Tây.
            </p>
          </div>
        </div>
      </section>

      {/* TẦM NHÌN - SỨ MỆNH */}
      <section className="container-page py-16">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-brand-900 p-8 text-white">
            <Compass className="h-8 w-8 text-brand-300" />
            <h3 className="mt-5 text-2xl font-black">Tầm nhìn</h3>
            <p className="mt-4 leading-7 text-brand-50/80">
              Trở thành đơn vị cung ứng và gia công sản phẩm nhôm được tin chọn hàng đầu tại An Giang
              và khu vực miền Tây, đồng hành cùng sự phát triển của khách hàng, đại lý và xưởng sản xuất.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-100 bg-white p-8">
            <Award className="h-8 w-8 text-brand-700" />
            <h3 className="mt-5 text-2xl font-black text-slate-950">Sứ mệnh</h3>
            <p className="mt-4 leading-7 text-slate-600">
              Cung cấp sản phẩm nhôm rõ nguồn gốc, tư vấn đúng nhu cầu và đồng hành cùng khách hàng
              trong suốt quá trình lựa chọn, thi công và sử dụng — từ công trình nhỏ đến hợp tác dài hạn
              với đại lý và xưởng sản xuất.
            </p>
          </div>
        </div>
      </section>

      {/* GIÁ TRỊ CỐT LÕI */}
      <section className="container-page py-16">
        <div className="max-w-2xl">
          <div className="eyebrow">Giá trị cốt lõi</div>
          <h2 className="section-title mt-3">Điều làm nên {companyContent.companyName}.</h2>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {coreValues.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-slate-100 bg-white p-6">
              <Icon className="h-8 w-8 text-brand-700" />
              <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LĨNH VỰC HOẠT ĐỘNG */}
      <section className="container-page py-16">
        <div className="max-w-2xl">
          <div className="eyebrow">Lĩnh vực hoạt động</div>
          <h2 className="section-title mt-3">Năm lĩnh vực cốt lõi.</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companyContent.businessScope.map((item, index) => (
            <div key={item} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 font-black text-brand-700">
                {index + 1}
              </span>
              <span className="font-semibold text-slate-900">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* NĂNG LỰC */}
      <section className="container-page py-16">
        <div className="rounded-[2rem] bg-brand-900 p-8 text-white sm:p-12">
          <div className="max-w-2xl">
            <div className="eyebrow text-brand-300">Năng lực</div>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Quy mô hoạt động hiện tại.</h2>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              [`${yearsActive}+`, "Năm kinh nghiệm"],
              ["50+", "Đại lý — đối tác"],
              ["3.000+", "Công trình"],
              ["10.000+", "Khách hàng tin dùng"]
            ].map(([num, label]) => (
              <div key={label}>
                <div className="text-3xl font-black text-brand-300 sm:text-4xl">{num}</div>
                <div className="mt-1 text-sm text-brand-50/75">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOWROOM & KHO */}
      <section className="container-page py-16">
        <div className="max-w-2xl">
          <div className="eyebrow">Cơ sở vật chất</div>
          <h2 className="section-title mt-3">Showroom & kho vật tư.</h2>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white">
            <div className="relative aspect-[4/3]">
              <Image src="/assets/categories/category-interior.webp" alt="Không gian trưng bày sản phẩm" fill sizes="50vw" className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="font-black text-slate-950">Không gian trưng bày</h3>
              <p className="mt-1 text-sm text-slate-600">Sản phẩm nhôm và nội thất nhôm trưng bày trực quan để khách hàng tham khảo.</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white">
            <div className="relative aspect-[4/3]">
              <Image src="/assets/categories/category-aluminum.webp" alt="Kho nguyên vật liệu nhôm" fill sizes="50vw" className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="font-black text-slate-950">Kho nguyên vật liệu</h3>
              <p className="mt-1 text-sm text-slate-600">Nhôm thanh và phụ kiện sẵn sàng cho gia công và giao hàng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ĐỐI TÁC */}
      {brands.length > 0 && (
        <section className="container-page py-16">
          <div className="max-w-2xl">
            <div className="eyebrow">Đối tác</div>
            <h2 className="section-title mt-3">Thương hiệu đang phân phối.</h2>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-8">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="flex aspect-[3/2] items-center justify-center rounded-2xl border border-slate-100 bg-white p-5"
              >
                {brand.logoUrl ? (
                  <div className="relative h-full w-full">
                    <Image src={brand.logoUrl} alt={brand.name} fill sizes="150px" className="object-contain" />
                  </div>
                ) : (
                  <span className="text-sm font-black uppercase tracking-wide text-slate-600">{brand.name}</span>
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
              <div className="text-sm font-bold uppercase tracking-[0.18em] text-brand-300">
                Hợp tác cùng {companyContent.companyName}
              </div>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                Trở thành đại lý hoặc nhận tư vấn công trình.
              </h2>
              <p className="mt-5 text-lg leading-8 text-brand-50/75">
                Gửi thông tin liên hệ, đội ngũ {companyContent.companyName} sẽ phản hồi trong thời gian sớm nhất.
              </p>
            </div>
            <Link
              href="/lien-he"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 font-black text-brand-900 transition hover:bg-brand-50"
            >
              Liên hệ ngay
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
