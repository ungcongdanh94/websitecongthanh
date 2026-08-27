import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import DOMPurify from "isomorphic-dompurify";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const getArticle = cache(async (slug: string) => {
  return prisma.article.findFirst({ where: { slug, status: "PUBLISHED" } });
});

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("vi-VN").format(date);
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "Bài viết không tồn tại | CÔNG THẢNH" };
  }

  const description = article.excerpt || article.title;

  return {
    title: `${article.title} | Tin tức CÔNG THẢNH`,
    description,
    openGraph: {
      title: article.title,
      description,
      images: article.coverUrl ? [{ url: article.coverUrl }] : undefined
    }
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <main className="container-page py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/tin-tuc" className="text-sm font-bold text-brand-700">
          ← Quay lại tin tức
        </Link>

        <div className="eyebrow mt-6">Tin tức</div>
        <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight md:text-5xl">{article.title}</h1>
        <div className="mt-4 text-sm font-semibold text-slate-400">{formatDate(article.publishedAt)}</div>

        {article.coverUrl && (
          <div className="relative mt-8 aspect-[1.9] overflow-hidden rounded-3xl">
            <Image src={article.coverUrl} alt={article.title} fill className="object-cover" priority />
          </div>
        )}

        {article.content ? (
          <div
            className="prose prose-slate mt-10 max-w-none text-lg leading-8 text-slate-700 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-slate-950 [&_ul]:mt-2 [&_li]:mt-1"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
          />
        ) : (
          <p className="mt-10 text-lg leading-8 text-slate-600">Nội dung bài viết đang được cập nhật.</p>
        )}
      </div>
    </main>
  );
}
