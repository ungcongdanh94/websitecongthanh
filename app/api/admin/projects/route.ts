import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

async function authorized() {
  return getAdminSession();
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await authorized())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const project = await prisma.project.update({
      where: { id },
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
    return NextResponse.json({ ok: false, message: "Không thể cập nhật dự án" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await authorized())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Không thể xóa dự án" }, { status: 500 });
  }
}
