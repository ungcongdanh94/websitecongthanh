import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Box, Calculator, FileSpreadsheet, WandSparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Phần mềm & công cụ thiết kế | CÔNG THẢNH",
  description: "Công cụ dựng hình song bảo vệ dùng thử ngay, cùng các công cụ tính vật tư và xuất bảng cắt cho tủ bếp nhôm đang phát triển, hướng tới tích hợp plugin SketchUp."
};

const SONGBAOVE_TOOL_URL = "https://songbaove.congthanhco.com/";

export default function SoftwarePage() {
  return (
    <section className="container-page py-16">
      <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-950 to-brand-600 p-8 text-white md:p-14">
        <div className="max-w-4xl">
          <div className="text-sm font-bold uppercase tracking-widest text-brand-200">Phần mềm CÔNG THẢNH</div>
          <h1 className="mt-4 text-5xl font-black md:text-7xl">Thiết kế nhanh. Tính vật tư chuẩn. Báo giá thuận tiện.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
            Công cụ dựng hình song bảo vệ đã dùng thử được ngay bên dưới. Các công cụ tủ bếp nhôm và plugin SketchUp đang được phát triển tiếp theo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={SONGBAOVE_TOOL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 font-bold text-brand-800"
            >
              Mở công cụ song bảo vệ
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
            <Link
              href="/lien-he"
              className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              Đăng ký nhận thông tin
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-4">
        {[
          [Box, "Dựng hình nhanh", SONGBAOVE_TOOL_URL],
          [Calculator, "Tính vật tư", null],
          [FileSpreadsheet, "Xuất bảng cắt", null],
          [WandSparkles, "Chuẩn bị tích hợp AI", null]
        ].map(([Icon, text, href], i) => {
          const C = Icon as typeof Box;
          const content = (
            <>
              <C className="h-8 w-8 text-brand-700" />
              <h2 className="mt-5 text-xl font-bold">{String(text)}</h2>
              {href ? (
                <span className="mt-2 inline-flex items-center text-sm font-bold text-brand-700">
                  Dùng thử ngay <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </span>
              ) : (
                <span className="mt-2 inline-block text-sm text-slate-500">Đang phát triển</span>
              )}
            </>
          );
          return href ? (
            <a
              key={i}
              href={href as string}
              target="_blank"
              rel="noreferrer"
              className="rounded-3xl border bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
            >
              {content}
            </a>
          ) : (
            <div key={i} className="rounded-3xl border bg-white p-6">
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
