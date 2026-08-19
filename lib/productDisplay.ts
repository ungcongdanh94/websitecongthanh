export function splitValues(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const COLOR_SWATCHES: Record<string, string> = {
  "trắng": "#FFFFFF",
  "đen": "#1C1C1C",
  "ghi xám": "#9CA3AF",
  "xám": "#9CA3AF",
  "ghi đậm": "#4B5563",
  "bạc": "#C7CBD1",
  "vàng đồng": "#B08D57",
  "đồng": "#B08D57",
  "champagne": "#D9BF8C",
  "vân gỗ": "#8B5E34",
  "nâu": "#6B4A2F",
  "xanh dương": "#2563EB",
  "xanh lá": "#16A34A",
  "đỏ": "#DC2626",
  "cam": "#EA580C",
  "vàng": "#EAB308"
};

// Trả về mã màu để hiện vòng tròn minh hoạ theo tên màu (tiếng Việt, không phân biệt hoa/thường).
// Nếu không nhận diện được tên, dùng màu xám trung tính làm mặc định — vẫn hiện đúng tên bằng chữ bên cạnh.
export function getSwatchColor(name: string): string {
  return COLOR_SWATCHES[name.trim().toLowerCase()] || "#D1D5DB";
}

const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/;

export type ColorEntry = { name: string; hex: string };

// Cho phép admin tự đưa mã màu chính xác thay vì chỉ dựa vào tên đoán được.
// Nhập "Trắng #FFFFFF" (tên rồi mã hex) sẽ dùng đúng mã hex đó — không cần khớp bảng tên có sẵn.
// Nhập chỉ tên (VD "Trắng") vẫn hoạt động như trước, tự tra bảng màu hoặc dùng xám mặc định.
export function parseColorEntry(entry: string): ColorEntry {
  const match = entry.match(HEX_PATTERN);
  if (match) {
    const hex = match[0];
    const name = entry.replace(hex, "").trim() || hex;
    return { name, hex };
  }
  return { name: entry, hex: getSwatchColor(entry) };
}
