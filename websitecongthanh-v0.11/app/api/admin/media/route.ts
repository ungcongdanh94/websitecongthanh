import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function GET(request: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
  const folder = request.nextUrl.searchParams.get("folder");
  const assets = await prisma.mediaAsset.findMany({
    where: folder && folder !== "all" ? { folder } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200
  });
  return NextResponse.json({ assets });
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });

  try {
    const form = await request.formData();
    const files = form.getAll("files").filter((item): item is File => item instanceof File);
    const requestedFolder = String(form.get("folder") || "general").toLowerCase();
    const folder = requestedFolder.replace(/[^a-z0-9-_]/g, "-").slice(0, 40) || "general";

    if (!files.length) return NextResponse.json({ message: "Chưa chọn ảnh" }, { status: 400 });
    if (files.length > 12) return NextResponse.json({ message: "Mỗi lần tối đa 12 ảnh" }, { status: 400 });

    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ message: `${file.name}: định dạng không hỗ trợ` }, { status: 400 });
      if (file.size > MAX_FILE_SIZE) return NextResponse.json({ message: `${file.name}: vượt quá 10 MB` }, { status: 400 });
    }

    const assets = [];
    for (const file of files) {
      const uploaded = await uploadImage(file, `congthanh/${folder}`);
      const asset = await prisma.mediaAsset.create({
        data: {
          publicId: uploaded.public_id,
          url: uploaded.url,
          secureUrl: uploaded.secure_url,
          fileName: file.name,
          mimeType: file.type,
          bytes: uploaded.bytes,
          width: uploaded.width || null,
          height: uploaded.height || null,
          folder
        }
      });
      assets.push(asset);
    }

    return NextResponse.json({ assets }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Không thể tải ảnh" }, { status: 500 });
  }
}
