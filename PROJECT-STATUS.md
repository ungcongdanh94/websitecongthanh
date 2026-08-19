# PROJECT STATUS — v0.17.0

## v0.17.0 — Đã dọn hết các việc tồn đọng

- CRM nối vào QuoteBuilder (chọn khách hàng có sẵn khi soạn báo giá)
- JSON-LD schema.org/Product cho trang chi tiết sản phẩm
- Bảng `Setting` được dùng thật (SEO trang chủ đọc từ đó)
- `/so-sanh` viết lại dùng database thật, chọn tối đa 4 sản phẩm bất kỳ
- Xóa mã chết: `ProductExplorer.tsx`, `ProductCard.tsx`, `data/products.ts`
- Bổ sung SEO metadata cho `/lien-he`, `/bang-gia`, `/phan-mem`

## Còn lại — chỉ 1 việc, cần Zen cung cấp thêm

- **Ảnh khối "Khuyến mãi" độ phân giải thấp** (234×139px, mờ trên màn hình lớn) — cần Zen gửi ảnh gốc chất lượng cao hơn (khuyến nghị ≥800×450px/ảnh) để thay vào `public/assets/promotions/`. Đây là việc duy nhất mình không tự làm được vì cần file ảnh thật.

## Toàn bộ lịch sử phiên bản

Xem chi tiết từng phiên bản (v0.9 → v0.17.0) tại `CHANGELOG.md`.

## Việc cần làm thủ công (không phải lỗi kỹ thuật)

- Cập nhật hotline, email chính thức (đang để trống có chủ đích, theo yêu cầu ban đầu)
- Cập nhật giá bán thật cho sản phẩm qua `/admin/products` hoặc import Excel qua `/admin/prices`
- Bổ sung catalogue, video kỹ thuật cho sản phẩm
- Thêm ảnh dự án thực tế nếu muốn thay ảnh minh hoạ hiện tại
