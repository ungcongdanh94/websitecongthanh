import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

type PriceUpdate = {
  productId: string;
  price: number | null;
  dealerPrice: number | null;
};

export async function PATCH(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updates: PriceUpdate[] = Array.isArray(body.updates) ? body.updates : [];
    const note = typeof body.note === "string" ? body.note.trim() || null : null;

    if (!updates.length) {
      return NextResponse.json({ ok: false, message: "Không có thay đổi nào" }, { status: 400 });
    }

    let updatedCount = 0;

    await prisma.$transaction(async (tx) => {
      for (const update of updates) {
        const existing = await tx.product.findUnique({
          where: { id: update.productId },
          select: { price: true, dealerPrice: true }
        });
        if (!existing) continue;

        await tx.product.update({
          where: { id: update.productId },
          data: {
            price: update.price === null ? null : update.price,
            dealerPrice: update.dealerPrice === null ? null : update.dealerPrice
          }
        });

        await tx.priceChange.create({
          data: {
            productId: update.productId,
            oldPrice: existing.price,
            newPrice: update.price === null ? null : update.price,
            oldDealerPrice: existing.dealerPrice,
            newDealerPrice: update.dealerPrice === null ? null : update.dealerPrice,
            note
          }
        });

        updatedCount += 1;
      }
    });

    return NextResponse.json({ ok: true, updatedCount });
  } catch (error) {
    console.error("UPDATE_PRICES_ERROR", error);
    return NextResponse.json({ ok: false, message: "Không thể cập nhật bảng giá" }, { status: 500 });
  }
}
