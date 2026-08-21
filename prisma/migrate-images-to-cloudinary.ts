import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function sign(params: Record<string, string | number>, apiSecret: string) {
  const input = Object.entries(params)
    .filter(([, value]) => value !== "" && value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return createHash("sha1").update(`${input}${apiSecret}`).digest("hex");
}

async function uploadFromRemoteUrl(sourceUrl: string, folder: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Chưa cấu hình CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = sign({ folder, timestamp }, apiSecret);

  const body = new URLSearchParams({
    file: sourceUrl, // Cloudinary tự tải ảnh từ URL này về host lại trên hệ thống của mình
    api_key: apiKey,
    timestamp: String(timestamp),
    folder,
    signature
  });

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error?.message || "Cloudinary không thể tải ảnh từ URL nguồn");
  }

  return result.secure_url as string;
}

async function main() {
  const products = await prisma.product.findMany({
    where: { imageUrl: { contains: "bizweb.dktcdn.net" } },
    select: { id: true, name: true, imageUrl: true }
  });

  console.log(`Tìm thấy ${products.length} sản phẩm còn dùng ảnh từ website cũ (bizweb.dktcdn.net).`);

  let success = 0;
  let failed = 0;

  for (const product of products) {
    if (!product.imageUrl) continue;
    try {
      const newUrl = await uploadFromRemoteUrl(product.imageUrl, "products");
      await prisma.product.update({ where: { id: product.id }, data: { imageUrl: newUrl } });
      success += 1;
      console.log(`✓ ${product.name}`);
    } catch (error) {
      failed += 1;
      console.error(`✗ ${product.name} — ${error instanceof Error ? error.message : "lỗi không rõ"}`);
    }
  }

  console.log(`Hoàn tất: ${success} ảnh đã chuyển sang Cloudinary, ${failed} lỗi.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
