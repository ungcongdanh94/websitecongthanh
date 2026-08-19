"use client";

import { useRef, useState } from "react";
import { Bold, Italic, Link2, List } from "lucide-react";
import { renderSafeMarkdown } from "@/lib/markdown";

export default function MarkdownEditor({
  name,
  defaultValue = "",
  placeholder,
  className = ""
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function wrapSelection(prefix: string, suffix: string = prefix) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd) || "chữ";
    const next = value.slice(0, selectionStart) + prefix + selected + suffix + value.slice(selectionEnd);
    setValue(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart + prefix.length, selectionStart + prefix.length + selected.length);
    });
  }

  function insertListItem() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart } = textarea;
    const needsNewline = selectionStart > 0 && value[selectionStart - 1] !== "\n";
    const insertion = `${needsNewline ? "\n" : ""}- Mục danh sách\n`;
    const next = value.slice(0, selectionStart) + insertion + value.slice(selectionStart);
    setValue(next);
  }

  function insertLink() {
    const url = window.prompt("Nhập URL:");
    if (!url) return;
    wrapSelection("[", `](${url})`);
  }

  return (
    <div className={className}>
      <input type="hidden" name={name} value={value} />
      <div className="flex items-center gap-1 rounded-t-2xl border border-b-0 border-slate-200 bg-slate-50 p-2">
        <button type="button" onClick={() => wrapSelection("**")} className="rounded-lg p-2 hover:bg-slate-200" title="Đậm">
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => wrapSelection("_")} className="rounded-lg p-2 hover:bg-slate-200" title="Nghiêng">
          <Italic className="h-4 w-4" />
        </button>
        <button type="button" onClick={insertListItem} className="rounded-lg p-2 hover:bg-slate-200" title="Danh sách">
          <List className="h-4 w-4" />
        </button>
        <button type="button" onClick={insertLink} className="rounded-lg p-2 hover:bg-slate-200" title="Liên kết">
          <Link2 className="h-4 w-4" />
        </button>
        <div className="mx-2 h-5 w-px bg-slate-300" />
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="rounded-lg px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-slate-200"
        >
          {showPreview ? "Chỉnh sửa" : "Xem trước"}
        </button>
      </div>

      {showPreview ? (
        <div
          className="min-h-40 rounded-b-2xl border border-slate-200 p-4 text-sm leading-6"
          dangerouslySetInnerHTML={{ __html: renderSafeMarkdown(value) || "<p class=\"text-slate-400\">Chưa có nội dung</p>" }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="min-h-40 w-full rounded-b-2xl border border-slate-200 p-4 text-sm outline-none focus:border-brand-500"
        />
      )}
    </div>
  );
}
