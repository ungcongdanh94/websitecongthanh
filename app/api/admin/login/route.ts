import { NextResponse } from "next/server";
import { createAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    const expectedEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const expectedPassword = String(process.env.ADMIN_PASSWORD || "");

    if (!expectedEmail || !expectedPassword) {
      return NextResponse.json(
        { ok: false, message: "Chưa cấu hình tài khoản quản trị" },
        { status: 500 }
      );
    }

    if (email !== expectedEmail || password !== expectedPassword) {
      return NextResponse.json(
        { ok: false, message: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    await createAdminSession(email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ADMIN_LOGIN_ERROR", error);
    return NextResponse.json(
      { ok: false, message: "Không thể đăng nhập" },
      { status: 500 }
    );
  }
}
