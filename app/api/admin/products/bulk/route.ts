import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const ALLOWED_STATUS = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export async function PATCH(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const ids: string[] = Array.isArray(body.ids) ? body.ids.filter((id: unknown) => typeof id === "string") : [];
    const status = String(body.status || "");

    if (!ids.length) {
      return NextResponse.json({ ok: false, message: "Chưa chọn sản phẩm nào" }, { status: 400 });
    }
    if (!ALLOWED_STATUS.includes(status)) {
      return NextResponse.json({ ok: false, message: "Trạng thái không hợp lệ" }, { status: 400 });
    }

    const result = await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" }
    });

    return NextResponse.json({ ok: true, updatedCount: result.count });
  } catch (error) {
    console.error("BULK_UPDATE_PRODUCTS_ERROR", error);
    return NextResponse.json({ ok: false, message: "Không thể cập nhật trạng thái" }, { status: 500 });
  }
}
