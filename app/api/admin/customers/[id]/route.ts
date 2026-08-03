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

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: String(body.name || "").trim(),
        phone: String(body.phone || "").trim(),
        email: String(body.email || "").trim() || null,
        company: String(body.company || "").trim() || null,
        address: String(body.address || "").trim() || null,
        note: String(body.note || "").trim() || null,
        source: String(body.source || "").trim() || null
      }
    });

    return NextResponse.json({ ok: true, customer });
  } catch (error) {
    console.error("UPDATE_CUSTOMER_ERROR", error);
    return NextResponse.json(
      { ok: false, message: "Không thể cập nhật. Số điện thoại có thể đã tồn tại." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.$transaction([
      prisma.quoteRequest.updateMany({ where: { customerId: id }, data: { customerId: null } }),
      prisma.customer.delete({ where: { id } })
    ]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE_CUSTOMER_ERROR", error);
    return NextResponse.json({ ok: false, message: "Không thể xóa khách hàng" }, { status: 500 });
  }
}
