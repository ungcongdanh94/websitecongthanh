import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { createQuoteNumber } from "@/lib/quote";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true }
  });

  return NextResponse.json({ ok: true, quotes });
}

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
        status: "NEW",
        source: "admin"
      }
    });

    return NextResponse.json({ ok: true, quote });
  } catch (error) {
    console.error("CREATE_QUOTE_ERROR", error);
    return NextResponse.json({ ok: false, message: "Không thể tạo báo giá" }, { status: 500 });
  }
}
