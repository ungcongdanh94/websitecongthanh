import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: String(body.name || "").trim(),
        slug: String(body.slug || "").trim().toLowerCase(),
        description: String(body.description || "").trim() || null,
        isActive: Boolean(body.isActive)
      }
    });

    return NextResponse.json({ ok: true, category });
  } catch (error) {
    console.error("UPDATE_CATEGORY_ERROR", error);
    return NextResponse.json({ ok: false, message: "Tên hoặc slug có thể đã tồn tại" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE_CATEGORY_ERROR", error);
    return NextResponse.json(
      { ok: false, message: "Không thể xóa — danh mục có thể đang chứa sản phẩm. Hãy chuyển sản phẩm sang danh mục khác trước." },
      { status: 500 }
    );
  }
}
