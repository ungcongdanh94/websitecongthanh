import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { categorySchema } from "@/lib/validators";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse({ ...body, slug: String(body.slug || "").trim().toLowerCase() });
    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null
      }
    });
    return NextResponse.json({ ok: true, category });
  } catch {
    return NextResponse.json({ ok: false, message: "Tên hoặc slug có thể đã tồn tại" }, { status: 500 });
  }
}
