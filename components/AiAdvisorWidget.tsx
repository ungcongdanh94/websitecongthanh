"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, X } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Chào bạn! Mình là trợ lý AI của CÔNG THẢNH 👋 Bạn cần tư vấn về nhôm, phụ kiện cửa hay nội thất nhôm? Cho mình biết loại công trình hoặc nhu cầu của bạn nhé."
};

export default function AiAdvisorWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  if (pathname.startsWith("/admin")) return null;

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.filter((m) => m !== GREETING) })
      });
      const result = await response.json();

      setMessages((current) => [
        ...current,
        { role: "assistant", content: result.reply || result.message || "Xin lỗi, mình chưa trả lời được. Vui lòng thử lại." }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "Không thể kết nối trợ lý AI lúc này. Vui lòng thử lại sau." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[520px] w-[340px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:w-[380px]">
          <div className="flex items-center justify-between bg-brand-800 px-5 py-4 text-white">
            <div>
              <div className="font-black">Trợ lý AI — CÔNG THẢNH</div>
              <div className="text-xs text-brand-200">● Đang hoạt động</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Đóng khung chat" className="rounded-full p-1 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto rounded-br-sm bg-brand-50 text-brand-900"
                    : "rounded-bl-sm bg-slate-100 text-slate-800"
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-500">
                Đang soạn trả lời...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-slate-100 p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Gửi"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-600 text-white disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Đóng trợ lý AI" : "Mở trợ lý AI"}
        className="grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-white shadow-2xl transition hover:bg-brand-700"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
