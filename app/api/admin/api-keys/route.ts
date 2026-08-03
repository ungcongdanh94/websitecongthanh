import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

function generateKey() {
  return `ct_live_${randomBytes(24).toString("hex")}`;
}

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  const keys = await prisma.apiKey.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ ok: true, keys });
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const label = String(body.label || "").trim();

    if (!label) {
      return NextResponse.json({ ok: false, message: "Cần đặt tên cho API key (ví dụ: SketchUp Plugin)" }, { status: 400 });
    }

    const apiKey = await prisma.apiKey.create({
      data: { key: generateKey(), label, isActive: true }
    });

    return NextResponse.json({ ok: true, apiKey });
  } catch (error) {
    console.error("CREATE_API_KEY_ERROR", error);
    return NextResponse.json({ ok: false, message: "Không thể tạo API key" }, { status: 500 });
  }
}
