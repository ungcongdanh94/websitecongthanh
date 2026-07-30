import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const allowed = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"];
    const status = allowed.includes(body.status) ? body.status : "NEW";

    const quote = await prisma.quoteRequest.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ ok: true, quote });
  } catch {
    return NextResponse.json({ ok: false, message: "Không thể cập nhật trạng thái" }, { status: 500 });
  }
}
