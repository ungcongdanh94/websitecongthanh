import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        title: String(body.title || "").trim(),
        slug: String(body.slug || "").trim().toLowerCase(),
        description: String(body.description || "").trim() || null,
        coverUrl: String(body.coverUrl || "").trim() || null,
        location: String(body.location || "").trim() || null,
        status: ["PUBLISHED", "ARCHIVED"].includes(body.status) ? body.status : "DRAFT"
      }
    });
    return NextResponse.json({ ok: true, project });
  } catch {
    return NextResponse.json({ ok: false, message: "Slug có thể đã tồn tại" }, { status: 500 });
  }
}
