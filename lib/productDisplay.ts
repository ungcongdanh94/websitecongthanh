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
