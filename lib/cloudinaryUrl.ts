// Tự động căn logo về đúng khung chuẩn của web (400x267, tỉ lệ 3:2) bằng transformation
// có sẵn của Cloudinary — không cần xử lý gì thêm lúc tải ảnh lên. Cloudinary tự "đọc" kích
// thước ảnh gốc và co giãn vừa khung, chèn nền trắng ở phần còn thiếu (không cắt, không méo).
// Nhờ vậy mọi logo hiện với tỉ lệ nhất quán, dù ảnh gốc vuông, ngang hay dọc khác nhau.
export function normalizeLogoUrl(url: string): string {
  const marker = "/image/upload/";
  const index = url.indexOf(marker);
  if (!url.includes("res.cloudinary.com") || index === -1) return url;

  const transform = "c_pad,w_400,h_267,b_white,q_auto,f_auto";
  return url.slice(0, index + marker.length) + transform + "/" + url.slice(index + marker.length);
}

// Tối ưu ảnh sản phẩm/dự án theo đúng kích thước hiển thị (card nhỏ vs trang chi tiết) —
// tự chọn định dạng nhẹ nhất cho từng trình duyệt (f_auto) và chất lượng vừa đủ (q_auto),
// tránh gửi nguyên ảnh gốc cho card nhỏ. Không phải ảnh Cloudinary thì trả về nguyên URL.
export function optimizeImageUrl(url: string, width: 300 | 600 | 900 | 1200 = 600): string {
  const marker = "/image/upload/";
  const index = url.indexOf(marker);
  if (!url.includes("res.cloudinary.com") || index === -1) return url;

  const transform = `c_limit,w_${width},q_auto,f_auto`;
  return url.slice(0, index + marker.length) + transform + "/" + url.slice(index + marker.length);
}
