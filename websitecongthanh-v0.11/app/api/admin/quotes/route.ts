import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { createQuoteNumber } from "@/lib/quote";

export async function POST() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const quote = await prisma.quoteRequest.create({
      data: {
        quoteNumber: createQuoteNumber(),
        customerName: "Khách hàng mới",
        phone: "",
        source: "admin",
        terms: "Giá trị báo giá có hiệu lực theo thời hạn ghi trên báo giá."
      },
      select: { id: true }
    });

    return NextResponse.json({ ok: true, quote });
  } catch (error) {
    console.error("CREATE_ADMIN_QUOTE_ERROR", error);
    return NextResponse.json({ ok: false, message: "Không thể tạo báo giá" }, { status: 500 });
  }
}
