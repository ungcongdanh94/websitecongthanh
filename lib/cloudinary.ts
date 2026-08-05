import { createHash } from "node:crypto";

function requireConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Chưa cấu hình CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET");
  }

  return { cloudName, apiKey, apiSecret };
}

function sign(params: Record<string, string | number>, apiSecret: string) {
  const input = Object.entries(params)
    .filter(([, value]) => value !== "" && value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${input}${apiSecret}`).digest("hex");
}

export async function uploadImage(file: File, folder: string) {
  const { cloudName, apiKey, apiSecret } = requireConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const signed = { folder, timestamp };
  const signature = sign(signed, apiSecret);
  const body = new FormData();

  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("folder", folder);
  body.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error?.message || "Cloudinary không thể tải ảnh");
  }

  return result as {
    public_id: string;
    url: string;
    secure_url: string;
    bytes: number;
    width?: number;
    height?: number;
    format?: string;
    original_filename?: string;
  };
}

export async function destroyImage(publicId: string) {
  const { cloudName, apiKey, apiSecret } = requireConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const signed = { public_id: publicId, timestamp };
  const signature = sign(signed, apiSecret);
  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: apiKey,
    signature
  });

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const result = await response.json();
  if (!response.ok || !["ok", "not found"].includes(result.result)) {
    throw new Error(result?.error?.message || "Không thể xóa ảnh trên Cloudinary");
  }
  return result;
}

// Tự động căn logo về đúng khung chuẩn của web (400x267, tỉ lệ 3:2) bằng transformation
// có sẵn của Cloudinary — không cần xử lý gì thêm lúc tải ảnh lên. Cloudinary tự "đọc" kích
// thước ảnh gốc và co giãn vừa khung, chèn nền trắng ở phần còn thiếu (không cắt, không méo).
// Nhờ vậy mọi logo hiện với tỉ lệ nhất quán, dù ảnh gốc vuông, ngang hay dọc khác nhau.
export function normalizeLogoUrl(url: string): string {
  const marker = "/image/upload/";
  const index = url.indexOf(marker);
  if (!url.includes("res.cloudinary.com") || index === -1) return url;

  const transform = "c_pad,w_400,h_267,b_white,q_auto,f_auto";
  return url.slice(0, index + marker.length) + transform + "/" + url.slice(index + marker.length);
}
