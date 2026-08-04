import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dự án thực tế | CÔNG THẢNH",
  description: "Các công trình và giải pháp nhôm — phụ kiện — nội thất thực tế do CÔNG THẢNH thi công tại An Giang và khu vực miền Tây."
};

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const { location = "" } = await searchParams;

  const [projects, locations] = await Promise.all([
    prisma.project.findMany({
      where: { status: "PUBLISHED", ...(location ? { location } : {}) },
      orderBy: { createdAt: "desc" }
    }),
    prisma.project.findMany({
      where: { status: "PUBLISHED", location: { not: null } },
      select: { location: true },
      distinct: ["location"],
      orderBy: { location: "asc" }
    })
  ]);

  return (
    <main className="container-page py-16">
      <div className="max-w-3xl">
        <div className="eyebrow">Công trình thực tế</div>
        <h1 className="section-title mt-3">Dự án tiêu biểu của CÔNG THẢNH.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Các công trình và giải pháp nhôm – phụ kiện – nội thất được cập nhật trực tiếp từ hệ thống quản trị.
        </p>
      </div>

      {locations.length > 1 && (
        <form className="mt-8 flex flex-wrap items-center gap-3">
          <select
            name="location"
            defaultValue={location}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold"
          >
            <option value="">Tất cả khu vực</option>
            {locations.map((item) => item.location && (
              <option key={item.location} value={item.location}>{item.location}</option>
            ))}
          </select>
          <button className="btn-secondary">Lọc theo khu vực</button>
        </form>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/du-an/${project.slug}`} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-soft">
            <div className="relative aspect-[4/3] bg-slate-100">
              {project.coverUrl ? (
                <Image src={project.coverUrl} alt={project.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
              ) : (
                <div className="grid h-full place-items-center text-slate-400">Chưa có ảnh</div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-black">{project.title}</h2>
              {project.location && (
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" /> {project.location}
                </div>
              )}
              <p className="mt-3 line-clamp-3 leading-7 text-slate-600">{project.description || "Xem chi tiết dự án."}</p>
            </div>
          </Link>
        ))}
      </div>

      {!projects.length && (
        <div className="mt-10 rounded-3xl border border-dashed p-10 text-center text-slate-500">
          Chưa có dự án công khai.
        </div>
      )}
    </main>
  );
}
