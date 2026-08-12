function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Chuyển 1 tập nhỏ, an toàn của markdown sang HTML để hiển thị mô tả sản phẩm có định dạng
// (đậm, nghiêng, danh sách, link) mà không cho phép chèn HTML/script tùy ý — mọi ký tự HTML
// trong nội dung gốc đều được escape trước, sau đó mới áp cú pháp markdown lên trên.
export function renderSafeMarkdown(raw: string): string {
  const escaped = escapeHtml(raw);
  const lines = escaped.split("\n");
  const htmlParts: string[] = [];
  let inList = false;

  for (const line of lines) {
    const bulletMatch = line.match(/^\s*[-*]\s+(.*)$/);
    if (bulletMatch) {
      if (!inList) {
        htmlParts.push("<ul class=\"list-disc pl-5\">");
        inList = true;
      }
      htmlParts.push(`<li>${inlineFormat(bulletMatch[1])}</li>`);
      continue;
    }
    if (inList) {
      htmlParts.push("</ul>");
      inList = false;
    }
    if (line.trim() === "") {
      htmlParts.push("<br />");
    } else {
      htmlParts.push(`<p>${inlineFormat(line)}</p>`);
    }
  }
  if (inList) htmlParts.push("</ul>");

  return htmlParts.join("\n");
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" class="underline" target="_blank" rel="noopener noreferrer">$1</a>');
}
