import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  const customers = await prisma.customer.findMany({
    include: { _count: { select: { quotes: true } } },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ ok: true, customers });
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();

    if (!name || !phone) {
      return NextResponse.json({ ok: false, message: "Thiếu tên hoặc số điện thoại" }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        email: String(body.email || "").trim() || null,
        company: String(body.company || "").trim() || null,
        address: String(body.address || "").trim() || null,
        note: String(body.note || "").trim() || null,
        source: String(body.source || "").trim() || null
      }
    });

    return NextResponse.json({ ok: true, customer });
  } catch (error) {
    console.error("CREATE_CUSTOMER_ERROR", error);
    return NextResponse.json(
      { ok: false, message: "Không thể tạo khách hàng. Số điện thoại có thể đã tồn tại." },
      { status: 500 }
    );
  }
}
