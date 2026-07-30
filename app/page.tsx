import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Calculator, Headphones, ShieldCheck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function HomePage() {
  const featured = products.filter((p) => p.featured);
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 text-white">
        <div className="container-page grid min-h-[680px] items-center gap-10 py-20 lg:grid-cols-2">
          <div className="relative z-10">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">Nhà phân phối nhôm & phụ kiện cao cấp</div>
            <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">Giải pháp nhôm hiện đại cho mọi công trình.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">Xem sản phẩm, so sánh thông số và tham khảo giá nhanh tại CÔNG THẢNH.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/san-pham" className="rounded-full bg-white px-6 py-3 font-bold text-brand-800">Xem sản phẩm</Link>
              <Link href="/bang-gia" className="rounded-full border border-white/40 px-6 py-3 font-bold">Xem bảng giá</Link>
            </div>
          </div>
          <div className="relative h-[430px] overflow-hidden rounded-[2.5rem] border border-white/20 shadow-2xl">
            <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85" alt="Công trình hiện đại" fill className="object-cover" priority />
          </div>
        </div>
      </section>

      <section className="container-page -mt-10 relative z-20">
        <div className="glass grid gap-4 rounded-3xl p-5 md:grid-cols-4">
          {[
            [BadgeCheck, "Sản phẩm chính hãng"],
            [Calculator, "Giá tham khảo rõ ràng"],
            [ShieldCheck, "Giải pháp đồng bộ"],
            [Headphones, "Hỗ trợ nhanh qua Zalo"]
          ].map(([Icon, text], i) => {
            const C = Icon as typeof BadgeCheck;
            return <div key={i} className="flex items-center gap-3 rounded-2xl p-3"><C className="h-7 w-7 text-brand-700" /><span className="font-bold">{String(text)}</span></div>
          })}
        </div>
      </section>

      <section className="container-page py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-sm font-bold uppercase tracking-widest text-brand-700">Sản phẩm nổi bật</div>
            <h2 className="section-title mt-3">Lựa chọn dành cho công trình cao cấp</h2>
          </div>
          <Link href="/san-pham" className="hidden font-bold text-brand-700 md:block">Xem tất cả <ArrowRight className="inline h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      <section className="bg-brand-50 py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <div className="text-sm font-bold uppercase tracking-widest text-brand-700">Vì sao chọn CÔNG THẢNH</div>
            <h2 className="section-title mt-3">Dễ xem, dễ so sánh, dễ ra quyết định.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["Danh mục sản phẩm rõ ràng", "Giá tham khảo cập nhật", "Thông số kỹ thuật dễ hiểu", "Tư vấn theo nhu cầu thực tế"].map((x) => (
              <div key={x} className="rounded-3xl bg-white p-6 font-bold shadow-sm">{x}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-24">
        <div className="overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 text-white md:p-14">
          <div className="max-w-3xl">
            <div className="text-sm font-bold uppercase tracking-widest text-brand-300">Cần báo giá nhanh?</div>
            <h2 className="mt-4 text-4xl font-black md:text-6xl">Gửi sản phẩm bạn quan tâm, đội ngũ CÔNG THẢNH sẽ tư vấn cấu hình phù hợp.</h2>
            <Link href="/lien-he" className="mt-8 inline-flex rounded-full bg-brand-500 px-6 py-3 font-bold text-white">Liên hệ ngay</Link>
          </div>
        </div>
      </section>
    </>
  );
}
