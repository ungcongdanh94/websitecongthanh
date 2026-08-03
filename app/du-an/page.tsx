import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findFirst({ where: { slug, status: "PUBLISHED" } });
  if (!project) notFound();

  return (
    <main className="container-page py-16">
      <div className="mx-auto max-w-5xl">
        <div className="eyebrow">Dự án thực tế</div>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">{project.title}</h1>
        {project.location && (
          <div className="mt-5 flex items-center gap-2 text-slate-500">
            <MapPin className="h-5 w-5" /> {project.location}
          </div>
        )}
        {project.coverUrl && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[2rem] bg-slate-100">
            <Image src={project.coverUrl} alt={project.title} fill priority className="object-cover" />
          </div>
        )}
        <div className="prose prose-slate mt-10 max-w-none text-lg leading-8 text-slate-700">
          {project.description || "Thông tin dự án đang được cập nhật."}
        </div>
      </div>
    </main>
  );
}
