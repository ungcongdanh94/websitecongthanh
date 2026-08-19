import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, ChevronRight, Factory, HardHat, Headphones, PenTool, Ruler, ShieldCheck } from "lucide-react";
import BrandsCarousel from "@/components/BrandsCarousel";
import { prisma } from "@/lib/prisma";
import { normalizeLogoUrl } from "@/lib/cloudinaryUrl";

export const dynamic = "force-dynamic";

const workProcess = [
  [Headphones,"Tư vấn","Tư vấn giải pháp phù hợp nhu cầu và ngân sách"],
  [Ruler,"Khảo sát","Khảo sát thực tế, đo đạc và đánh giá hiện trạng"],
  [PenTool,"Thiết kế","Thiết kế bản vẽ 2D/3D chi tiết và hiện đại"],
  [Factory,"Sản xuất","Sản xuất trên dây chuyền công nghệ cao"],
  [HardHat,"Thi công","Thi công lắp đặt chuyên nghiệp, đúng tiến độ"],
  [ShieldCheck,"Bảo hành","Bảo hành dài hạn, hỗ trợ tận tâm"],
] as const;

const catalog = [
  ["cua-di-mo-quay.webp","Cửa đi mở quay"],["cua-di-mo-truot.webp","Cửa đi mở trượt"],["cua-di-xep-truot.webp","Cửa đi xếp trượt"],["cua-di-vom.webp","Cửa đi vòm"],
  ["cua-so-mo-quay.webp","Cửa sổ mở quay"],["cua-so-mo-truot.webp","Cửa sổ mở trượt"],["cua-so-mo-hat.webp","Cửa sổ mở hất"],["cua-so-mo-quay-lat.webp","Cửa sổ mở quay lật"],
  ["vach-kinh.webp","Vách kính"],["cua-lua-treo.webp","Cửa lùa treo"],["nha-kinh.webp","Nhà kính"],["kinh-co-dinh.webp","Kính cố định"],
];

export default async function HomePage() {
  const [brands, projects] = await Promise.all([
    prisma.brand.findMany({ where:{isActive:true}, orderBy:{name:"asc"}, take:10 }),
    prisma.project.findMany({ where:{status:"PUBLISHED"}, orderBy:{createdAt:"desc"}, take:4 }),
  ]);
  return <>
    <section className="relative overflow-hidden bg-brand-950 text-white">
      <Image src="/assets/hero/hero-home-desktop.webp" alt="Giải pháp nhôm cao cấp CÔNG THẢNH" fill priority quality={95} className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
      <div className="container-page relative grid min-h-[690px] items-center gap-10 py-12 lg:grid-cols-[1.05fr_.75fr] lg:py-16">
        <div className="max-w-2xl">
          <div className="inline-flex rounded-full border border-white/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[.14em] text-brand-100 backdrop-blur">✓ Xingfa · Namsung · Draho · Candy · Chính hãng</div>
          <h1 className="mt-7 text-5xl font-black uppercase leading-[.98] tracking-tight sm:text-6xl lg:text-7xl">Nhôm cao cấp <span className="mt-2 block text-brand-300">Bền vững cùng thời gian</span></h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-white/85 sm:text-lg">CÔNG THẢNH cung cấp giải pháp nhôm toàn diện cho cửa đi, cửa sổ, vách kính, tủ bếp, lan can, hàng rào và nội thất cao cấp.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/san-pham" className="btn-primary bg-brand-500 px-7">Xem sản phẩm <ArrowRight className="ml-2 h-4 w-4"/></Link><Link href="/lien-he" className="rounded-full border border-white/30 bg-black/20 px-7 py-3 font-bold backdrop-blur transition hover:bg-white/15">Nhận báo giá →</Link></div>
          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">{[[BadgeCheck,"Nhôm chính hãng"],[ShieldCheck,"Độ bền vượt trội"],[Factory,"Gia công chính xác"],[ShieldCheck,"Bảo hành dài hạn"]].map(([I,t]:any)=><div key={t} className="rounded-2xl border border-white/15 bg-black/25 p-3 backdrop-blur"><I className="h-5 w-5 text-brand-300"/><div className="mt-2 text-xs font-bold">{t}</div></div>)}</div>
        </div>
        <div className="rounded-[2rem] border border-white/15 bg-brand-950/75 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
          <div className="text-sm font-black uppercase tracking-[.14em] text-brand-200">Quy trình làm việc chuyên nghiệp</div>
          <div className="mt-5 space-y-2.5">{workProcess.map(([Icon,title,text],i)=><div key={title} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.045] p-3.5 transition hover:bg-white/10"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300"><Icon className="h-5 w-5"/></div><div className="min-w-0 flex-1"><div className="font-extrabold"><span className="mr-3 text-xs text-brand-300">{String(i+1).padStart(2,"0")}</span>{title}</div><div className="mt-1 text-xs leading-5 text-white/60">{text}</div></div><ChevronRight className="h-4 w-4 text-brand-300"/></div>)}</div>
        </div>
      </div>
    </section>

    <section className="bg-white py-20"><div className="container-page"><div className="flex items-end justify-between gap-6"><div><div className="eyebrow">Sản phẩm nổi bật</div><h2 className="section-title mt-3">Giải pháp nhôm cao cấp</h2></div><Link href="/san-pham" className="btn-secondary hidden sm:inline-flex">Xem tất cả sản phẩm <ArrowRight className="ml-2 h-4 w-4"/></Link></div><div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">{catalog.map(([file,title])=><Link href="/san-pham" key={file} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="relative aspect-[4/3] overflow-hidden"><Image src={`/assets/catalog/${file}`} alt={title} fill className="object-cover transition duration-500 group-hover:scale-105"/></div><div className="p-4 text-center text-sm font-extrabold uppercase text-slate-900">{title}</div></Link>)}</div></div></section>

    <section className="bg-brand-950 py-16 text-white"><div className="container-page grid gap-8 lg:grid-cols-[1.1fr_2fr]"><div><div className="text-xs font-bold uppercase tracking-[.18em] text-brand-300">Về CÔNG THẢNH</div><h2 className="mt-3 text-4xl font-black leading-tight">Đối tác tin cậy<br/>cho mọi công trình</h2><p className="mt-5 max-w-md text-sm leading-7 text-brand-100/70">Giải pháp đồng bộ từ tư vấn, sản phẩm đến thi công, hướng tới chất lượng bền vững và trải nghiệm chuyên nghiệp.</p><Link href="/gioi-thieu" className="btn-primary mt-6 bg-brand-500">Tìm hiểu thêm →</Link></div><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[["20+","Năm kinh nghiệm"],["1000+","Khách hàng"],["5000+","Công trình"],["100%","Chính hãng"]].map(([n,l])=><div key={l} className="grid min-h-40 place-content-center rounded-2xl border border-white/10 bg-white/[.035] p-5 text-center"><div className="text-4xl font-black">{n}</div><div className="mt-3 text-xs font-bold uppercase tracking-wide text-brand-300">{l}</div></div>)}</div></div></section>

    {projects.length>0 && <section className="bg-white py-20"><div className="container-page"><div className="flex items-end justify-between"><div><div className="eyebrow">Dự án tiêu biểu</div><h2 className="section-title mt-3">Công trình nổi bật</h2></div><Link href="/du-an" className="font-bold text-brand-800">Xem tất cả dự án →</Link></div><div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{projects.map(p=><Link href={`/du-an/${p.slug}`} key={p.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="relative aspect-[4/3] bg-slate-100">{p.coverUrl?<Image src={p.coverUrl} alt={p.title} fill className="object-cover transition duration-500 group-hover:scale-105"/>:<Building2 className="absolute inset-0 m-auto h-10 w-10 text-slate-300"/>}</div><div className="p-5"><h3 className="font-black text-slate-950">{p.title}</h3>{p.location&&<p className="mt-1 text-xs text-slate-500">{p.location}</p>}</div></Link>)}</div></div></section>}

    <section className="py-20"><div className="container-page"><div className="rounded-[2rem] bg-brand-900 px-7 py-12 text-white sm:px-12 lg:flex lg:items-center lg:justify-between"><div><div className="text-sm font-bold uppercase tracking-[.15em] text-brand-300">Cần tư vấn ngay?</div><h2 className="mt-3 text-3xl font-black sm:text-4xl">Đội ngũ CÔNG THẢNH luôn sẵn sàng hỗ trợ.</h2><p className="mt-3 text-brand-100/70">Gửi nhu cầu để nhận tư vấn cấu hình và báo giá phù hợp công trình.</p></div><Link href="/lien-he" className="mt-7 inline-flex rounded-full bg-brand-500 px-7 py-4 font-black lg:mt-0">Liên hệ ngay <ArrowRight className="ml-2 h-5 w-5"/></Link></div></div></section>

    {brands.length>0 && <section className="bg-white py-16"><div className="container-page"><div className="text-center"><div className="eyebrow">Đối tác · Thương hiệu</div><h2 className="mt-3 text-3xl font-black text-slate-950">Thương hiệu CÔNG THẢNH phân phối</h2></div><BrandsCarousel brands={brands.map(b=>({id:b.id,name:b.name,logoUrl:b.logoUrl?normalizeLogoUrl(b.logoUrl):null}))}/></div></section>}
  </>;
}
