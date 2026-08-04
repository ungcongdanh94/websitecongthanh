import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import companyContent from "@/data/company-content.json";

export const dynamic = "force-dynamic";

const MODEL = "gpt-5.6"; // Đổi ở đây nếu OpenAI cập nhật model khuyến nghị mới
const MAX_HISTORY_MESSAGES = 10;

type ChatMessage = { role: "user" | "assistant"; content: string };

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

async function buildSystemPrompt(): Promise<string> {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true, brand: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    take: 60
  });

  const catalogLines = products.map((product) => {
    const parts = [
      product.name,
      `danh mục: ${product.category.name}`,
      product.brand ? `thương hiệu: ${product.brand.name}` : null,
      product.aluminumSystem ? `hệ: ${product.aluminumSystem}` : null,
      product.color ? `màu: ${product.color}` : null,
      product.price ? `giá: ${Number(product.price).toLocaleString("vi-VN")}đ/${product.unit || "sp"}` : "giá: liên hệ",
      `link: /san-pham/${product.slug}`
    ].filter(Boolean);
    return `- ${parts.join(" | ")}`;
  });

  return `Bạn là trợ lý AI tư vấn sản phẩm của ${companyContent.companyName}, doanh nghiệp ${companyContent.positioning}

Phạm vi hoạt động: chỉ tư vấn về nhôm thanh, phụ kiện cửa nhôm, gia công sơn tĩnh điện và nội thất nhôm — đúng lĩnh vực kinh doanh của công ty. Nếu khách hỏi ngoài phạm vi này, lịch sự từ chối và hướng khách quay lại chủ đề nhôm/phụ kiện/nội thất nhôm.

Nguyên tắc trả lời:
- CHỈ giới thiệu sản phẩm có trong danh sách dưới đây — không bịa thêm sản phẩm, thương hiệu hoặc mức giá không có trong danh sách.
- Nếu sản phẩm chưa có giá công khai, nói rõ "giá liên hệ" và đề nghị khách để lại số điện thoại hoặc gọi hotline để được báo giá chính xác theo cấu hình.
- Khi giới thiệu sản phẩm, luôn kèm đường link dạng /san-pham/slug-san-pham để khách bấm xem chi tiết.
- Trả lời ngắn gọn, thân thiện, bằng tiếng Việt. Ưu tiên hỏi lại 1 câu để hiểu rõ nhu cầu (loại cửa, không gian, ngân sách) nếu câu hỏi còn mơ hồ, thay vì liệt kê tất cả sản phẩm.
- Không tự nhận là con người, không hứa hẹn thời gian giao hàng hoặc chính sách bảo hành cụ thể nếu không có trong dữ liệu.

Danh sách sản phẩm hiện có (${products.length} sản phẩm):
${catalogLines.join("\n")}`;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Trợ lý AI chưa được kích hoạt. Vui lòng liên hệ hotline để được tư vấn." },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`ai-advisor:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, message: "Bạn đang gửi quá nhiều câu hỏi liên tục. Vui lòng thử lại sau ít phút." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const rawMessages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];

    const messages = rawMessages
      .filter((message) => message && (message.role === "user" || message.role === "assistant") && typeof message.content === "string")
      .slice(-MAX_HISTORY_MESSAGES)
      .map((message) => ({ role: message.role, content: message.content.slice(0, 2000) }));

    if (!messages.length) {
      return NextResponse.json({ ok: false, message: "Vui lòng nhập câu hỏi." }, { status: 400 });
    }

    const systemPrompt = await buildSystemPrompt();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        messages: [{ role: "system", content: systemPrompt }, ...messages]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OPENAI_API_ERROR", response.status, errorText);
      return NextResponse.json(
        { ok: false, message: "Trợ lý AI đang gặp sự cố. Vui lòng thử lại hoặc liên hệ hotline." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({ ok: true, reply: reply || "Xin lỗi, mình chưa hiểu câu hỏi. Bạn có thể nói rõ hơn không?" });
  } catch (error) {
    console.error("AI_ADVISOR_ERROR", error);
    return NextResponse.json({ ok: false, message: "Có lỗi xảy ra. Vui lòng thử lại." }, { status: 500 });
  }
}
