import { prisma } from "@/lib/prisma";
import MediaManager from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return <main className="container-page py-12"><div className="mb-8"><div className="eyebrow">CMS</div><h1 className="mt-3 text-4xl font-black">Media Manager</h1><p className="mt-3 text-slate-600">Tải và dùng lại ảnh cho sản phẩm, dự án và banner.</p></div><MediaManager initialAssets={assets} /></main>;
}
