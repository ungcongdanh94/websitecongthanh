import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { brandSchema } from "@/lib/validators";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = brandSchema.safeParse({ ...body, slug: String(body.slug || "").trim().toLowerCase() });
    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ" }, { status: 400 });
    }

    const brand = await prisma.brand.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
        logoUrl: parsed.data.logoUrl || null
      }
    });
    return NextResponse.json({ ok: true, brand });
  } catch {
    return NextResponse.json({ ok: false, message: "Tên hoặc slug có thể đã tồn tại" }, { status: 500 });
  }
}
