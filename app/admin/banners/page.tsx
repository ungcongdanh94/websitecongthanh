import { prisma } from "@/lib/prisma";
import BannerForm from "@/components/admin/BannerForm";

export const dynamic = "force-dynamic";

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });

  return (
    <main className="container-page py-12">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div className="eyebrow">CMS</div>
          <h1 className="mt-3 text-4xl font-black">Banner</h1>
          <div className="mt-8"><BannerForm /></div>
        </div>
        <div className="overflow-hidden rounded-3xl border bg-white">
          {banners.map((banner) => (
            <div key={banner.id} className="border-b p-5 last:border-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold">{banner.title}</div>
                  <div className="mt-1 text-sm text-slate-500">{banner.subtitle || "Không có mô tả"}</div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${banner.isActive ? "bg-brand-50 text-brand-800" : "bg-slate-100 text-slate-500"}`}>
                  {banner.isActive ? "Hoạt động" : "Đã tắt"}
                </span>
              </div>
            </div>
          ))}
          {!banners.length && <div className="p-10 text-center text-slate-500">Chưa có banner.</div>}
        </div>
      </div>
    </main>
  );
}
