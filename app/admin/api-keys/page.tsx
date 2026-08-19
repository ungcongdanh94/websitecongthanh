import { prisma } from "@/lib/prisma";
import ApiKeyManager from "@/components/admin/ApiKeyManager";

export const dynamic = "force-dynamic";

export default async function ApiKeysPage() {
  const keys = await prisma.apiKey.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="container-page py-12">
      <div className="max-w-3xl">
        <div className="eyebrow">Tích hợp</div>
        <h1 className="mt-3 text-4xl font-black">API Keys</h1>
        <p className="mt-3 text-slate-600">
          Quản lý khóa truy cập cho <code>/api/catalog/products</code> — dùng để kết nối plugin SketchUp
          hoặc các ứng dụng bên ngoài khác. Xem tài liệu API tại <code>API-CATALOG.md</code> trong mã nguồn.
        </p>
      </div>

      <div className="mt-8">
        <ApiKeyManager
          initialKeys={keys.map((key) => ({
            id: key.id,
            key: key.key,
            label: key.label,
            isActive: key.isActive,
            lastUsedAt: key.lastUsedAt ? key.lastUsedAt.toISOString() : null,
            createdAt: key.createdAt.toISOString()
          }))}
        />
      </div>
    </main>
  );
}
