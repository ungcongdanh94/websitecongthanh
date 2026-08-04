import Link from "next/link";
import type { Metadata } from "next";
import { Box, Calculator, FileSpreadsheet, WandSparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Phần mềm & công cụ thiết kế | CÔNG THẢNH",
  description: "Công cụ dựng hình, tính vật tư và xuất bảng cắt cho song bảo vệ và tủ bếp nhôm — đang phát triển, hướng tới tích hợp plugin SketchUp."
};

export default function SoftwarePage() {
  return (
    <section className="container-page py-16">
      <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-950 to-brand-600 p-8 text-white md:p-14">
        <div className="max-w-4xl">
          <div className="text-sm font-bold uppercase tracking-widest text-brand-200">Phần mềm CÔNG THẢNH</div>
          <h1 className="mt-4 text-5xl font-black md:text-7xl">Thiết kế nhanh. Tính vật tư chuẩn. Báo giá thuận tiện.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">Khu vực giới thiệu các công cụ thiết kế song bảo vệ, tủ bếp nhôm và plugin SketchUp đang phát triển.</p>
          <Link href="/lien-he" className="mt-8 inline-flex rounded-full bg-white px-6 py-3 font-bold text-brand-800">Đăng ký nhận thông tin</Link>
        </div>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-4">
        {[
          [Box, "Dựng hình nhanh"],
          [Calculator, "Tính vật tư"],
          [FileSpreadsheet, "Xuất bảng cắt"],
          [WandSparkles, "Chuẩn bị tích hợp AI"]
        ].map(([Icon, text], i) => {
          const C = Icon as typeof Box;
          return <div key={i} className="rounded-3xl border bg-white p-6"><C className="h-8 w-8 text-brand-700" /><h2 className="mt-5 text-xl font-bold">{String(text)}</h2></div>
        })}
      </div>
    </section>
  );
}
