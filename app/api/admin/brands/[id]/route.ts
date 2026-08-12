import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { brandSchema } from "@/lib/validators";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    const parsed = brandSchema.safeParse({ ...body, slug: String(body.slug || "").trim().toLowerCase() });
    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ" }, { status: 400 });
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
        logoUrl: parsed.data.logoUrl || null,
        isActive: Boolean(body.isActive)
      }
    });

    return NextResponse.json({ ok: true, brand });
  } catch (error) {
    console.error("UPDATE_BRAND_ERROR", error);
    return NextResponse.json({ ok: false, message: "Tên hoặc slug có thể đã tồn tại" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.brand.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE_BRAND_ERROR", error);
    return NextResponse.json(
      { ok: false, message: "Không thể xóa — thương hiệu có thể đang được sản phẩm sử dụng. Hãy chuyển sản phẩm sang thương hiệu khác trước." },
      { status: 500 }
    );
  }
}
