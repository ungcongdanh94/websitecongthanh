import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Box, Sun } from "lucide-react";

export const metadata: Metadata = {
  title: "Phần mềm & công cụ thiết kế | CÔNG THẢNH",
  description: "Công cụ dựng hình song bảo vệ và tính toán điện mặt trời — dùng thử miễn phí ngay trên trình duyệt."
};

const SONGBAOVE_TOOL_URL = "https://songbaove.congthanhco.com/";
const DIENMATTROI_TOOL_URL = "https://dienmattroi.congthanhco.com/";

const tools = [
  {
    icon: Box,
    name: "Song bảo vệ",
    desc: "Dựng hình nhanh, tùy chỉnh kích thước và mẫu mã ngay trên trình duyệt.",
    href: SONGBAOVE_TOOL_URL
  },
  {
    icon: Sun,
    name: "Điện mặt trời",
    desc: "Tính toán, thiết kế hệ thống điện mặt trời phù hợp công trình.",
    href: DIENMATTROI_TOOL_URL
  }
];

export default function SoftwarePage() {
  return (
    <section className="container-page py-16">
      <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-950 to-brand-600 p-8 text-white md:p-14">
        <div className="max-w-4xl">
          <div className="text-sm font-bold uppercase tracking-widest text-brand-200">Phần mềm CÔNG THẢNH</div>
          <h1 className="mt-4 text-5xl font-black md:text-7xl">Thiết kế nhanh. Báo giá thuận tiện.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
            Hai công cụ dùng thử miễn phí ngay bên dưới — không cần cài đặt, mở trực tiếp trên trình duyệt.
          </p>
          <div className="mt-8">
            <Link
              href="/lien-he"
              className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              Đăng ký nhận thông tin
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {tools.map((tool) => (
          <a
            key={tool.name}
            href={tool.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-3xl border bg-white p-7 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
          >
            <tool.icon className="h-9 w-9 text-brand-700" />
            <h2 className="mt-5 text-xl font-bold">{tool.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{tool.desc}</p>
            <span className="mt-4 inline-flex items-center text-sm font-bold text-brand-700">
              Dùng thử ngay <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
