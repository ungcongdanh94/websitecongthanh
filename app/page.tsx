import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Factory, Headphones, PenTool, Ruler, ShieldCheck, Users, Wrench, Medal, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const process = [
  [Headphones,"Tiếp nhận yêu cầu","Lắng nghe & tiếp nhận thông tin khách hàng"],
  [Ruler,"Khảo sát tư vấn","Khảo sát thực tế & tư vấn giải pháp tối ưu"],
  [PenTool,"Thiết kế báo giá","Thiết kế 2D/3D & báo giá chi tiết"],
  [Factory,"Sản xuất","Sản xuất theo tiêu chuẩn, kiểm soát chất lượng"],
  [Wrench,"Thi công","Thi công chuyên nghiệp, đúng tiến độ"],
  [ShieldCheck,"Bảo hành bảo trì","Bảo hành dài hạn, hỗ trợ nhanh chóng"]
] as const;
const products=[
 ["Cửa đi mở quay","cua-di-mo-quay"],["Cửa đi mở trượt","cua-di-mo-truot"],["Cửa đi xếp trượt","cua-di-xep-truot"],["Cửa đi vòm","cua-di-vom"],
 ["Cửa sổ mở quay","cua-so-mo-quay"],["Cửa sổ mở trượt","cua-so-mo-truot"],["Cửa sổ mở hất","cua-so-mo-hat"],["Cửa sổ mở quay lật","cua-so-mo-quay-lat"],
 ["Vách kính","vach-kinh"],["Cửa lùa treo","cua-lua-treo"],["Nhà kính","nha-kinh"],["Kính cố định","kinh-co-dinh"]
];
const projectFallback=[
 ["Biệt thự ven biển","Vũng Tàu","/assets/projects/project-villa.webp"],
 ["Nhà phố hiện đại","TP. Hồ Chí Minh","/assets/projects/project-townhouse.webp"],
 ["Resort cao cấp","Phú Quốc","/assets/projects/project-hotel.webp"],
 ["Showroom CÔNG THẢNH","Long Xuyên, An Giang","/assets/projects/project-showroom.webp"]
];
const news=[
 ["Xu hướng thiết kế cửa nhôm hiện đại năm 2026","/assets/solutions/solution-villa.webp"],
 ["So sánh nhôm Xingfa, Namsung và cách lựa chọn phù hợp","/assets/solutions/solution-townhouse.webp"],
 ["Bí quyết chọn cửa nhôm phù hợp với từng loại công trình","/assets/solutions/solution-apartment.webp"]
];

export default async function HomePage(){
 let dbProjects:any[]=[]; let brands:any[]=[];
 try { [dbProjects,brands]=await Promise.all([
   prisma.project.findMany({where:{status:"PUBLISHED"},orderBy:{createdAt:"desc"},take:4}),
   prisma.brand.findMany({where:{isActive:true},orderBy:{name:"asc"},take:6})
 ]); } catch {}
 const projects=dbProjects.length?dbProjects.map(p=>[p.title,p.location||"CÔNG THẢNH",p.coverUrl||"/assets/projects/project-villa.webp",p.slug]):projectFallback;
 return <main className="bg-white text-slate-950">
   <section className="relative min-h-[620px] overflow-hidden bg-[#062e25] text-white">
     <Image src="/assets/hero/hero-home-desktop.webp" alt="Nhôm cao cấp CÔNG THẢNH" fill priority className="object-cover" />
     <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/48 to-black/15" />
     <div className="container-page relative grid min-h-[620px] items-center gap-10 py-12 lg:grid-cols-[1.02fr_.72fr]">
       <div className="max-w-[610px]">
         <div className="inline-flex rounded-full border border-white/20 bg-black/35 px-4 py-2 text-xs font-extrabold uppercase tracking-[.14em] text-white/90">XINGFA · NAMSUNG · DRAHO · CANDY · CHÍNH HÃNG</div>
         <h1 className="mt-7 text-5xl font-black uppercase leading-[.98] tracking-tight md:text-6xl">Nhôm cao cấp <span className="mt-2 block text-[#65d69a]">Bền vững cùng<br/>thời gian</span></h1>
         <p className="mt-7 max-w-[560px] text-base leading-7 text-white/90">CÔNG THẢNH cung cấp giải pháp nhôm toàn diện cho cửa đi, cửa sổ, vách kính, tủ bếp, lan can, hàng rào và nội thất cao cấp.</p>
         <div className="mt-8 flex gap-3">
           <Link href="/san-pham" className="rounded-md bg-[#08a865] px-6 py-3.5 text-sm font-black">XEM SẢN PHẨM <ArrowRight className="ml-2 inline h-4 w-4"/></Link>
           <Link href="/lien-he" className="rounded-md border border-white/40 bg-black/25 px-6 py-3.5 text-sm font-black">NHẬN BÁO GIÁ <ArrowRight className="ml-2 inline h-4 w-4"/></Link>
         </div>
         <div className="mt-9 grid max-w-[650px] grid-cols-2 border-t border-white/15 sm:grid-cols-4">
           {[[BadgeCheck,"Nhôm chính hãng"],[Medal,"Độ bền vượt trội"],[Wrench,"Thi công chuyên nghiệp"],[ShieldCheck,"Bảo hành dài hạn"]].map(([Icon,t]:any)=><div key={t} className="flex items-center gap-2 border-r border-white/10 px-3 py-4 first:pl-0"><Icon className="h-6 w-6 shrink-0 text-[#55e19b]"/><span className="text-[11px] font-bold leading-4">{t}</span></div>)}
         </div>
       </div>
       <div className="overflow-hidden rounded-[24px] border border-white/15 bg-[#063b30]/92 p-5 shadow-2xl backdrop-blur-md">
         <div className="mb-4 text-sm font-black uppercase tracking-[.12em] text-[#76dda7]">Quy trình làm việc chuyên nghiệp</div>
         <div className="space-y-2.5">
           {process.map(([Icon,t,d],i)=><div key={t} className="grid grid-cols-[38px_44px_1fr] items-center gap-3 rounded-xl border border-white/10 bg-white/[.035] px-3 py-3">
             <div className="grid h-8 w-8 place-items-center rounded-full bg-[#25bd76] text-sm font-black">{i+1}</div>
             <div className="grid h-10 w-10 place-items-center rounded-full border border-[#4bcf8d]/50"><Icon className="h-5 w-5"/></div>
             <div><div className="text-sm font-black">{t}</div><div className="mt-0.5 text-[10px] leading-4 text-white/65">{d}</div></div>
           </div>)}
         </div>
       </div>
     </div>
   </section>

   <section className="container-page py-14">
     <div className="mb-7 flex items-end justify-between">
       <div><div className="text-xs font-black uppercase tracking-[.12em] text-[#168055]">Sản phẩm nổi bật</div><h2 className="mt-2 text-3xl font-black uppercase">Giải pháp nhôm cao cấp</h2></div>
       <Link href="/san-pham" className="hidden rounded-md border border-[#0b6e4d]/40 px-4 py-2.5 text-xs font-black uppercase text-[#075d43] sm:inline-flex">Xem tất cả sản phẩm <ArrowRight className="ml-2 h-4 w-4"/></Link>
     </div>
     <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
       {products.map(([name,slug])=><Link href="/san-pham" key={slug} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_4px_16px_rgba(15,23,42,.06)]">
         <div className="relative aspect-[1.42] overflow-hidden bg-[#f4f5f2] p-2.5 sm:p-3"><div className="relative h-full w-full overflow-hidden rounded-md"><Image src={`/assets/catalog/${slug}.webp`} alt={name} fill sizes="(min-width:1024px) 14vw, (min-width:768px) 23vw, 46vw" className="object-contain object-center transition duration-300 group-hover:scale-[1.015]"/></div></div>
         <div className="grid min-h-[42px] place-items-center px-2 py-2 text-center text-[10px] font-black uppercase leading-4 sm:text-[11px]">{name}</div>
       </Link>)}
     </div>
   </section>

   <section className="bg-[#063c31] text-white">
     <div className="container-page grid lg:grid-cols-[1.45fr_repeat(4,1fr)]">
       <div className="py-9 pr-8"><div className="text-xs font-black uppercase tracking-wider text-[#63d89a]">Về CÔNG THẢNH</div><h2 className="mt-3 text-2xl font-black uppercase leading-tight">Đối tác tin cậy<br/>cho mọi công trình</h2><p className="mt-4 max-w-sm text-xs leading-5 text-white/72">Với kinh nghiệm nhiều năm trong lĩnh vực nhôm cao cấp, CÔNG THẢNH cam kết mang đến sản phẩm chính hãng, chất lượng vượt trội và dịch vụ chuyên nghiệp nhất.</p><Link href="/gioi-thieu" className="mt-5 inline-flex rounded-md bg-[#0aa765] px-4 py-2.5 text-xs font-black uppercase">Tìm hiểu thêm →</Link></div>
       {[[Building2,"20+","Năm kinh nghiệm"],[Users,"1000+","Khách hàng"],[Factory,"5000+","Công trình"],[Medal,"100%","Chính hãng"]].map(([Icon,n,l]:any)=><div key={l} className="grid place-items-center border-t border-white/10 py-8 text-center lg:border-l lg:border-t-0"><div><Icon className="mx-auto h-9 w-9 text-lime-400"/><div className="mt-4 text-3xl font-black">{n}</div><div className="mt-1 text-xs font-black uppercase text-lime-300">{l}</div></div></div>)}
     </div>
   </section>

   <section className="container-page py-14"><div className="mb-6 flex items-end justify-between"><div><div className="text-xs font-black uppercase tracking-wider text-[#168055]">Dự án tiêu biểu</div><h2 className="mt-2 text-3xl font-black uppercase">Công trình nổi bật</h2></div><Link href="/du-an" className="text-xs font-black uppercase">Xem tất cả dự án →</Link></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{projects.slice(0,4).map((p:any)=><Link href={p[3]?`/du-an/${p[3]}`:"/du-an"} key={p[0]} className="overflow-hidden rounded-lg border bg-white shadow-sm"><div className="relative aspect-[1.55]"><Image src={p[2]} alt={p[0]} fill className="object-cover"/></div><div className="p-4"><div className="text-sm font-black uppercase">{p[0]}</div><div className="mt-1 text-xs text-slate-500">{p[1]}</div></div></Link>)}</div></section>

   <section className="container-page pb-14"><div className="mb-6 flex items-end justify-between"><h2 className="text-xl font-black uppercase">Tin tức mới nhất</h2><span className="text-xs font-black uppercase">Xem tất cả tin tức →</span></div><div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr_1fr_290px]">{[...news,["Quy trình thi công cửa nhôm chuẩn kỹ thuật","/assets/solutions/solution-villa.webp"]].map(([t,img])=><div key={t} className="overflow-hidden rounded-lg border bg-white shadow-sm"><div className="relative aspect-[1.65]"><Image src={img} alt={t} fill className="object-cover"/></div><div className="p-3"><div className="text-[10px] text-slate-400">10/05/2026</div><div className="mt-2 text-xs font-bold leading-5">{t}</div><div className="mt-3 text-[11px] font-bold text-[#08764f]">Đọc thêm →</div></div></div>)}<div className="rounded-lg bg-[#064333] p-6 text-white"><div className="text-xl font-black uppercase">Cần tư vấn ngay?</div><p className="mt-3 text-xs leading-5 text-white/70">Đội ngũ chuyên viên của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.</p><Link href="/lien-he" className="mt-6 inline-flex rounded-md bg-[#0cad68] px-5 py-3 text-xs font-black uppercase">Liên hệ ngay →</Link><div className="mt-5 text-xs font-bold">Hotline: 0908 22 99 77</div></div></div></section>

   <section className="container-page pb-14"><div className="text-center text-xs font-black uppercase tracking-wider text-[#17694e]">Đối tác – thương hiệu</div><div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">{(brands.length?brands.map((b:any)=>b.name):["XINGFA","NAMSUNG","DRAHO","CMECH","CANDY","KIN LONG"]).slice(0,6).map((b:any)=><div key={typeof b==='string'?b:b.name} className="grid min-h-[76px] place-items-center rounded-lg border bg-white px-4 text-xl font-black text-[#17694e] shadow-sm">{typeof b==='string'?b:b.name}</div>)}</div></section>
 </main>
}
