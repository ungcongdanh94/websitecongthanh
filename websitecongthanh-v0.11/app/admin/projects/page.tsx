import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">CMS</div>
          <h1 className="mt-3 text-4xl font-black">Dự án</h1>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">Thêm dự án</Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border bg-white">
        {projects.map((project) => (
          <div key={project.id} className="flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4 last:border-0">
            <div>
              <div className="font-bold">{project.title}</div>
              <div className="mt-1 text-sm text-slate-500">
                {project.location || "Chưa có địa điểm"} · {project.status === "PUBLISHED" ? "Công khai" : project.status === "ARCHIVED" ? "Lưu trữ" : "Bản nháp"}
              </div>
            </div>
            <div className="flex gap-4">
              <Link href={`/admin/projects/${project.id}`} className="font-semibold text-brand-700">Sửa</Link>
              <DeleteProjectButton id={project.id} title={project.title} />
            </div>
          </div>
        ))}
        {!projects.length && <div className="p-10 text-center text-slate-500">Chưa có dự án.</div>}
      </div>
    </main>
  );
}
