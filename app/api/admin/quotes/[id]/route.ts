import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { calculateQuote, type QuoteLineInput } from "@/lib/quote";

const allowedStatuses = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"] as const;

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const status = allowedStatuses.includes(body.status) ? body.status : "NEW";
    const quote = await prisma.quoteRequest.update({ where: { id }, data: { status } });
    return NextResponse.json({ ok: true, quote });
  } catch {
    return NextResponse.json({ ok: false, message: "Không thể cập nhật trạng thái" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const rawItems: QuoteLineInput[] = Array.isArray(body.items)
      ? body.items.filter((item: QuoteLineInput) => String(item.productName || "").trim())
      : [];
    const calculation = calculateQuote(rawItems, Number(body.discountRate), Number(body.taxRate));
    const status = allowedStatuses.includes(body.status) ? body.status : "NEW";

    const quote = await prisma.$transaction(async (tx) => {
      await tx.quoteItem.deleteMany({ where: { quoteRequestId: id } });
      return tx.quoteRequest.update({
        where: { id },
        data: {
          customerName: String(body.customerName || "").trim() || "Khách hàng",
          phone: String(body.phone || "").trim(),
          email: String(body.email || "").trim() || null,
          company: String(body.company || "").trim() || null,
          address: String(body.address || "").trim() || null,
          customerId: body.customerId ? String(body.customerId) : null,
          note: String(body.note || "").trim() || null,
          terms: String(body.terms || "").trim() || null,
          status,
          validUntil: body.validUntil ? new Date(`${body.validUntil}T00:00:00`) : null,
          subtotal: calculation.subtotal,
          discountRate: calculation.discountRate,
          discountValue: calculation.discountValue,
          taxRate: calculation.taxRate,
          taxValue: calculation.taxValue,
          total: calculation.total,
          items: {
            create: calculation.items.map((item) => ({
              productId: item.productId || null,
              productName: String(item.productName).trim(),
              quantity: item.quantity,
              unit: item.unit || null,
              unitPrice: item.unitPrice,
              discountRate: item.discountRate,
              lineTotal: item.lineTotal,
              note: item.note || null,
              sortOrder: item.sortOrder || 0
            }))
          }
        },
        include: { items: true }
      });
    });

    return NextResponse.json({ ok: true, quote });
  } catch (error) {
    console.error("UPDATE_QUOTE_ERROR", error);
    return NextResponse.json({ ok: false, message: "Không thể lưu báo giá" }, { status: 500 });
  }
}
