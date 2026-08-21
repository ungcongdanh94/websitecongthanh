import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Cache để không upload trùng cùng 1 URL nguồn nhiều lần (vd nhiều sản phẩm
// cùng tham chiếu 1 ảnh logo hoặc 1 ảnh sơ đồ chung).
const uploadCache = new Map<string, string>();

function sign(params: Record<string, string | number>, apiSecret: string) {
  const input = Object.entries(params)
    .filter(([, value]) => value !== "" && value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return createHash("sha1").update(`${input}${apiSecret}`).digest("hex");
}

// true nếu URL đã là ảnh host trên Cloudinary (không cần upload lại)
function isAlreadyCloudinary(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes("res.cloudinary.com") || url.includes("cloudinary.com/");
}

async function uploadFromRemoteUrl(sourceUrl: string, folder: string): Promise<string> {
  const cached = uploadCache.get(sourceUrl);
  if (cached) return cached;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Chưa cấu hình CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = sign({ folder, timestamp }, apiSecret);

  const body = new URLSearchParams({
    file: sourceUrl, // Cloudinary tự tải ảnh từ URL này về host lại trên hệ thống của mình,
    // hoạt động với BAT KY domain nguon nao (bizweb.dktcdn.net, onedoor.com.vn,
    // aseanwindow.com, thietbicuacuon.com, asnwindoor.com...) - server chay script
    // nay khong can tu tai anh, Cloudinary lo phan do.
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
    throw new Error(result?.error?.message || `Cloudinary khong the tai anh tu ${sourceUrl}`);
  }

  const newUrl = result.secure_url as string;
  uploadCache.set(sourceUrl, newUrl);
  return newUrl;
}

// Lay toan bo URL anh xuat hien trong cac the <img src="..."> cua mot doan HTML
function extractImgUrls(html: string): string[] {
  const matches = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)];
  return [...new Set(matches.map((m) => m[1]))];
}

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, imageUrl: true, gallery: true, description: true }
  });

  console.log(`Kiem tra ${products.length} san pham...`);

  let imagesUploaded = 0;
  let productsUpdated = 0;
  let failed = 0;

  for (const product of products) {
    const data: { imageUrl?: string; gallery?: string[]; description?: string } = {};
    let changed = false;

    try {
      // 1) Anh dai dien chinh
      if (product.imageUrl && !isAlreadyCloudinary(product.imageUrl)) {
        data.imageUrl = await uploadFromRemoteUrl(product.imageUrl, "products");
        imagesUploaded += 1;
        changed = true;
      }

      // 2) Anh phu (gallery)
      const gallery = Array.isArray(product.gallery) ? (product.gallery as string[]) : [];
      if (gallery.length) {
        const newGallery: string[] = [];
        let galleryChanged = false;
        for (const url of gallery) {
          if (isAlreadyCloudinary(url)) {
            newGallery.push(url);
            continue;
          }
          const newUrl = await uploadFromRemoteUrl(url, "products");
          newGallery.push(newUrl);
          imagesUploaded += 1;
          galleryChanged = true;
        }
        if (galleryChanged) {
          data.gallery = newGallery;
          changed = true;
        }
      }

      // 3) Anh chen giua bai mo ta chi tiet (ke ca anh tu web khac:
      //    onedoor.com.vn, aseanwindow.com, thietbicuacuon.com, asnwindoor.com...)
      if (product.description) {
        const urls = extractImgUrls(product.description);
        const urlsToMigrate = urls.filter((u) => !isAlreadyCloudinary(u));
        if (urlsToMigrate.length) {
          let newDescription = product.description;
          for (const url of urlsToMigrate) {
            const newUrl = await uploadFromRemoteUrl(url, "products");
            newDescription = newDescription.split(url).join(newUrl);
            imagesUploaded += 1;
          }
          data.description = newDescription;
          changed = true;
        }
      }

      if (changed) {
        await prisma.product.update({ where: { id: product.id }, data });
        productsUpdated += 1;
        console.log(`OK ${product.name}`);
      }
    } catch (error) {
      failed += 1;
      console.error(`LOI ${product.name} - ${error instanceof Error ? error.message : "loi khong ro"}`);
    }
  }

  console.log(
    `\nHoan tat: ${imagesUploaded} anh da chuyen sang Cloudinary, ${productsUpdated} san pham duoc cap nhat, ${failed} loi.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
