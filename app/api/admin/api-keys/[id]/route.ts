import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    const apiKey = await prisma.apiKey.update({
      where: { id },
      data: { isActive: Boolean(body.isActive) }
    });

    return NextResponse.json({ ok: true, apiKey });
  } catch (error) {
    console.error("UPDATE_API_KEY_ERROR", error);
    return NextResponse.json({ ok: false, message: "Không thể cập nhật API key" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.apiKey.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE_API_KEY_ERROR", error);
    return NextResponse.json({ ok: false, message: "Không thể xóa API key" }, { status: 500 });
  }
}
