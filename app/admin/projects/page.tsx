import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <main className="container-page py-12">
      <div className="max-w-3xl">
        <div className="eyebrow">Dự án</div>
        <h1 className="mt-3 text-4xl font-black">Chỉnh sửa dự án</h1>
        <div className="mt-8">
          <ProjectForm project={{
            id: project.id,
            title: project.title,
            slug: project.slug,
            description: project.description,
            coverUrl: project.coverUrl,
            location: project.location,
            status: project.status
          }} />
        </div>
      </div>
    </main>
  );
}
