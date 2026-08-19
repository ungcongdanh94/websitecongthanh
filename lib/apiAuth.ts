import { prisma } from "@/lib/prisma";

export async function validateApiKey(request: Request): Promise<{ ok: true } | { ok: false; message: string; status: number }> {
  const provided = request.headers.get("x-api-key")?.trim();

  if (!provided) {
    return { ok: false, message: "Thiếu API key. Gửi kèm header 'x-api-key'.", status: 401 };
  }

  const apiKey = await prisma.apiKey.findUnique({ where: { key: provided } });

  if (!apiKey || !apiKey.isActive) {
    return { ok: false, message: "API key không hợp lệ hoặc đã bị thu hồi.", status: 401 };
  }

  // Cập nhật lastUsedAt không đồng bộ (không chặn response)
  prisma.apiKey
    .update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } })
    .catch(() => null);

  return { ok: true };
}
