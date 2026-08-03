import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updates = Array.isArray(body.updates) ? body.updates : [];
    const note = String(body.note || "").trim() || null;

    if (!updates.length || updates.length > 500) {
      return NextResponse.json({ ok: false, message: "Danh sách cập nhật không hợp lệ" }, { status: 400 });
    }

    let updatedCount = 0;
    await prisma.$transaction(async (tx) => {
      for (const update of updates) {
        const productId = String(update.productId || "");
        const current = await tx.product.findUnique({
          where: { id: productId },
          select: { price: true, dealerPrice: true }
        });
        if (!current) continue;

        const price = update.price === null || update.price === "" ? null : Number(update.price);
        const dealerPrice = update.dealerPrice === null || update.dealerPrice === "" ? null : Number(update.dealerPrice);
        if ((price !== null && (!Number.isFinite(price) || price < 0)) || (dealerPrice !== null && (!Number.isFinite(dealerPrice) || dealerPrice < 0))) {
          throw new Error("Giá không hợp lệ");
        }

        const oldPrice = current.price === null ? null : Number(current.price);
        const oldDealerPrice = current.dealerPrice === null ? null : Number(current.dealerPrice);
        if (oldPrice === price && oldDealerPrice === dealerPrice) continue;

        await tx.product.update({ where: { id: productId }, data: { price, dealerPrice } });
        await tx.priceChange.create({
          data: {
            productId,
            oldPrice,
            newPrice: price,
            oldDealerPrice,
            newDealerPrice: dealerPrice,
            note
          }
        });
        updatedCount += 1;
      }
    });

    return NextResponse.json({ ok: true, updatedCount });
  } catch (error) {
    console.error("BULK_PRICE_UPDATE_ERROR", error);
    return NextResponse.json({ ok: false, message: "Không thể cập nhật bảng giá" }, { status: 500 });
  }
}
