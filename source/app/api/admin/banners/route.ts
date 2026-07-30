import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const banner = await prisma.banner.create({
      data: {
        title: String(body.title || "").trim(),
        subtitle: String(body.subtitle || "").trim() || null,
        imageUrl: String(body.imageUrl || "").trim() || null,
        buttonLabel: String(body.buttonLabel || "").trim() || null,
        buttonUrl: String(body.buttonUrl || "").trim() || null,
        sortOrder: Number(body.sortOrder || 0),
        isActive: Boolean(body.isActive)
      }
    });
    return NextResponse.json({ ok: true, banner });
  } catch {
    return NextResponse.json({ ok: false, message: "Không thể tạo banner" }, { status: 500 });
  }
}
