import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const brand = await prisma.brand.create({
      data: {
        name: String(body.name || "").trim(),
        slug: String(body.slug || "").trim().toLowerCase(),
        description: String(body.description || "").trim() || null
      }
    });
    return NextResponse.json({ ok: true, brand });
  } catch {
    return NextResponse.json({ ok: false, message: "Tên hoặc slug có thể đã tồn tại" }, { status: 500 });
  }
}
