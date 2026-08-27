import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tin tức | CÔNG THẢNH",
  description: "Cập nhật xu hướng thiết kế, kinh nghiệm chọn cửa nhôm và quy trình thi công từ CÔNG THẢNH."
};

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("vi-VN").format(date);
}

export default async function NewsPage() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" }
  });

  return (
    <main className="container-page py-16">
      <div className="max-w-3xl">
        <div className="eyebrow">Tin tức</div>
        <h1 className="section-title mt-3">Kinh nghiệm & xu hướng cửa nhôm.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Chia sẻ kinh nghiệm chọn nhôm, xu hướng thiết kế và quy trình thi công từ đội ngũ CÔNG THẢNH.
        </p>
      </div>

      {articles.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/tin-tuc/${article.slug}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-soft"
            >
              {article.coverUrl && (
                <div className="relative aspect-[1.65]">
                  <Image src={article.coverUrl} alt={article.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="text-xs font-semibold text-slate-400">{formatDate(article.publishedAt)}</div>
                <h2 className="mt-2 text-lg font-black leading-snug text-slate-950">{article.title}</h2>
                {article.excerpt && <p className="mt-2 text-sm leading-6 text-slate-600">{article.excerpt}</p>}
                <div className="mt-4 text-sm font-bold text-brand-700">Đọc thêm →</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-bold">Chưa có bài viết nào</h2>
        </div>
      )}
    </main>
  );
}
