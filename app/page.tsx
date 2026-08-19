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
 return <main className="bg-[#f8faf9] text-slate-950">
   <section className="relative min-h-[560px] overflow-hidden bg-[#062e25] text-white lg:min-h-[610px]">
     <Image src="/assets/hero/hero-home-desktop.webp" alt="Giải pháp nhôm CÔNG THẢNH" fill priority className="object-cover" />
     <div className="absolute inset-0 bg-gradient-to-r from-[#031d18]/95 via-[#031d18]/60 to-[#031d18]/15" />
     <div className="container-page relative grid min-h-[560px] items-center gap-10 py-14 lg:min-h-[610px] lg:grid-cols-[1.05fr_.95fr]">
       <div className="max-w-[650px]">
         <div className="text-xs font-extrabold uppercase tracking-[.16em] text-brand-300">Nhôm cao cấp – bền vững cùng thời gian</div>
         <h1 className="mt-5 text-4xl font-black uppercase leading-[1.06] tracking-tight md:text-6xl">Giải pháp nhôm toàn diện <span className="block text-brand-300">cho không gian hiện đại</span></h1>
         <p className="mt-6 max-w-xl text-base leading-7 text-white/85">CÔNG THẢNH cung cấp giải pháp nhôm cao cấp cho cửa đi, cửa sổ, vách kính, lan can, hàng rào và nội thất — bền đẹp, an toàn và tinh tế.</p>
         <div className="mt-8 flex flex-wrap gap-3"><Link href="/san-pham" className="rounded-md bg-brand-600 px-6 py-3 text-sm font-extrabold uppercase">Xem sản phẩm <ArrowRight className="ml-2 inline h-4 w-4"/></Link><Link href="/lien-he" className="rounded-md border border-white/60 bg-black/20 px-6 py-3 text-sm font-extrabold uppercase">Nhận báo giá <ArrowRight className="ml-2 inline h-4 w-4"/></Link></div>
       </div>
       <div className="grid overflow-hidden rounded-2xl border border-white/15 bg-[#062e25]/90 shadow-2xl backdrop-blur-md sm:grid-cols-3">
         {[[BadgeCheck,"Sản phẩm chính hãng","Đa dạng hệ nhôm cao cấp"],[Headphones,"Tư vấn chuyên nghiệp","Giải pháp phù hợp mọi công trình"],[Medal,"Thi công chuẩn kỹ thuật","Đội ngũ tay nghề cao"],[Ruler,"Đo đạc chính xác","Khảo sát tận nơi, báo giá nhanh"],[ShieldCheck,"Bảo hành dài hạn","Bảo hành chính hãng"],[Users,"Hỗ trợ sau bán hàng","Đồng hành trọn đời công trình"]].map(([Icon,t,d]:any)=><div key={t} className="border-b border-r border-white/10 p-6 text-center"><Icon className="mx-auto h-8 w-8 text-lime-400"/><div className="mt-3 font-extrabold">{t}</div><div className="mt-1 text-xs leading-5 text-white/65">{d}</div></div>)}
       </div>
     </div>
   </section>

   <section className="container-page relative z-10 -mt-8"><div className="rounded-2xl bg-white px-6 py-7 shadow-[0_18px_55px_rgba(15,23,42,.12)] lg:px-8"><div className="grid gap-7 lg:grid-cols-[180px_1fr]"><div><div className="text-xs font-black uppercase tracking-wider text-brand-700">Quy trình làm việc</div><h2 className="mt-2 text-2xl font-black uppercase">Chuyên nghiệp</h2></div><div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-6">{process.map(([Icon,t,d],i)=><div key={t} className="relative text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-brand-300 text-brand-700"><Icon className="h-5 w-5"/></div><div className="mt-3 text-xs font-black uppercase">{t}</div><div className="mt-1 text-[10px] leading-4 text-slate-500">{d}</div>{i<5&&<ArrowRight className="absolute -right-3 top-4 hidden h-4 w-4 text-brand-600 lg:block"/>}</div>)}</div></div></div></section>

   <section className="container-page py-16"><div className="grid gap-8 lg:grid-cols-[190px_1fr]"><div className="self-center"><div className="text-xs font-black uppercase tracking-wider text-brand-700">Danh mục sản phẩm</div><h2 className="mt-3 text-3xl font-black uppercase leading-tight">Giải pháp nhôm cao cấp</h2><Link href="/san-pham" className="mt-6 inline-flex items-center rounded-md border border-brand-600 px-4 py-2 text-xs font-extrabold uppercase text-brand-800">Xem tất cả sản phẩm <ArrowRight className="ml-2 h-4 w-4"/></Link></div><div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">{products.map(([name,slug])=><Link href="/san-pham" key={slug} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-[1.12] overflow-hidden"><Image src={`/assets/catalog/${slug}.webp`} alt={name} fill className="object-cover transition duration-500 group-hover:scale-105"/></div><div className="p-3 text-center text-[11px] font-black uppercase">{name}</div></Link>)}</div></div></section>

   <section className="container-page pb-16"><div className="grid overflow-hidden rounded-xl bg-[#043d31] text-white lg:grid-cols-[1.35fr_repeat(4,1fr)]"><div className="p-7 lg:p-8"><div className="text-xs font-black uppercase tracking-wider text-brand-300">Về CÔNG THẢNH</div><h2 className="mt-3 text-2xl font-black uppercase">Đối tác tin cậy<br/>cho mọi công trình</h2><p className="mt-4 text-xs leading-5 text-white/70">Với kinh nghiệm nhiều năm trong lĩnh vực nhôm cao cấp, CÔNG THẢNH cam kết mang đến sản phẩm chính hãng, chất lượng vượt trội và dịch vụ chuyên nghiệp.</p></div>{[[Building2,"20+","Năm kinh nghiệm"],[Users,"1000+","Khách hàng"],[Factory,"5000+","Công trình"],[Medal,"100%","Chính hãng"]].map(([Icon,n,l]:any)=><div key={l} className="border-t border-white/10 p-7 text-center lg:border-l lg:border-t-0"><Icon className="mx-auto h-9 w-9 text-lime-400"/><div className="mt-4 text-3xl font-black">{n}</div><div className="mt-1 text-xs font-bold uppercase text-lime-300">{l}</div></div>)}</div></section>

   <section className="container-page pb-16"><div className="mb-6 flex items-end justify-between"><div><div className="text-xs font-black uppercase tracking-wider text-brand-700">Dự án tiêu biểu</div><h2 className="mt-2 text-3xl font-black uppercase">Công trình nổi bật</h2></div><Link href="/du-an" className="text-xs font-extrabold uppercase">Xem tất cả dự án →</Link></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{projects.slice(0,4).map((p:any,i:number)=><Link href={p[3]?`/du-an/${p[3]}`:"/du-an"} key={p[0]} className="overflow-hidden rounded-lg border bg-white shadow-sm"><div className="relative aspect-[1.55]"><Image src={p[2]} alt={p[0]} fill className="object-cover"/></div><div className="p-4"><div className="font-black uppercase">{p[0]}</div><div className="mt-1 text-xs text-slate-500">{p[1]}</div></div></Link>)}</div></section>

   <section className="container-page pb-14"><div className="mb-6 flex items-end justify-between"><div><div className="text-xs font-black uppercase tracking-wider text-brand-700">Tin tức mới nhất</div><h2 className="mt-2 text-3xl font-black uppercase">Kiến thức & xu hướng</h2></div></div><div className="grid gap-5 lg:grid-cols-[1fr_1fr_1fr_280px]">{news.map(([t,img])=><div key={t} className="flex overflow-hidden rounded-lg border bg-white shadow-sm"><div className="relative w-28 shrink-0"><Image src={img} alt={t} fill className="object-cover"/></div><div className="p-4"><div className="text-xs font-bold leading-5">{t}</div><div className="mt-3 text-xs font-bold text-brand-700">Đọc thêm →</div></div></div>)}<div className="rounded-lg bg-[#064333] p-6 text-white"><div className="text-xl font-black uppercase">Cần tư vấn ngay?</div><p className="mt-2 text-xs leading-5 text-white/70">Đội ngũ chuyên viên của chúng tôi luôn sẵn sàng hỗ trợ bạn.</p><Link href="/lien-he" className="mt-5 inline-flex rounded-md bg-brand-500 px-4 py-3 text-xs font-black uppercase">Liên hệ ngay →</Link></div></div></section>

   <section className="container-page pb-16"><div className="text-center text-xs font-black uppercase tracking-wider text-brand-800">Đối tác – thương hiệu</div><div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">{(brands.length?brands.map((b:any)=>b.name):["XINGFA","NAMSUNG","DRAHO","CMECH","CANDY","KIN LONG"]).slice(0,6).map((b:any)=><div key={typeof b==='string'?b:b.name} className="grid min-h-20 place-items-center rounded-lg border bg-white px-4 text-xl font-black text-brand-800 shadow-sm">{typeof b==='string'?b:b.name}</div>)}</div></section>

   <section className="bg-brand-800 py-5 text-white"><div className="container-page flex flex-col items-center justify-between gap-4 sm:flex-row"><div><div className="font-black">Bạn cần tư vấn giải pháp phù hợp?</div><div className="text-xs text-white/70">Đội ngũ CÔNG THẢNH luôn sẵn sàng hỗ trợ.</div></div><div className="flex items-center gap-5"><div className="flex items-center gap-2 text-lg font-black"><Phone className="h-5 w-5"/> 0908 22 99 77</div><Link href="/lien-he" className="rounded-md bg-amber-400 px-5 py-3 text-xs font-black uppercase text-slate-950">Gửi yêu cầu tư vấn →</Link></div></div></section>
 </main>
}
