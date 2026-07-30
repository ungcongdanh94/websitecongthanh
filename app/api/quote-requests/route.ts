import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quoteRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = quoteRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const quote = await prisma.quoteRequest.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        email: data.email || null,
        company: data.company || null,
        note: data.note || null,
        source: "website",
        items: data.productName
          ? {
              create: [{
                productName: data.productName,
                quantity: data.quantity,
                unit: data.unit || null
              }]
            }
          : undefined
      },
      select: { id: true, createdAt: true }
    });

    return NextResponse.json({ ok: true, quote });
  } catch (error) {
    console.error("QUOTE_REQUEST_ERROR", error);
    return NextResponse.json(
      { ok: false, message: "Không thể gửi yêu cầu lúc này" },
      { status: 500 }
    );
  }
}
