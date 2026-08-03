# PROJECT STATUS — v0.15.0

## Phase 3 (v0.15.0) — Hoàn thành

- API key auth cho `/api/catalog/products` (model `ApiKey` mới + trang quản trị `/admin/api-keys`)
- Rate limit 60 request/phút/key
- Phân trang (`page`, `pageSize`) cho catalog API
- Response catalog có thêm `gallery` và `catalogUrl`
- Tài liệu API đầy đủ tại `API-CATALOG.md`

## v0.14.0 — Tích hợp asset thật + seed dữ liệu thật (Hoàn thành)

- Logo thật ở Header (màu) và Footer (trắng), thay placeholder "CT"
- Hero trang chủ dùng ảnh thật `hero-homepage.webp`
- Khối "Khuyến mãi đang diễn ra" — 6 ảnh từ `/assets/promotions`
- `prisma/seed.ts` viết lại: đọc từ `data/site-assets.json` + `data/brand-content.json`, upsert 3 danh mục / 6 thương hiệu / 6 sản phẩm (có ảnh + gallery) / 4 dự án (có ảnh) / 1 banner trang chủ — an toàn chạy lại nhiều lần, không xoá dữ liệu cũ
- Thêm `Banner.slug` (schema mới, tuỳ chọn) để seed có thể upsert ổn định

## Phase 1 (v0.12.0) — Hoàn thành

- Bộ lọc sản phẩm nâng cao: khoảng giá, sắp xếp, phân trang
- Thư viện ảnh sản phẩm (gallery) trong CMS + trang chi tiết
- Import/Export Excel thật cho bảng giá
- Sửa lỗi in báo giá PDF (mất letterhead/chữ ký do CSS in ấn)
- Sửa lỗi thiếu trường `description` khi tạo sản phẩm mới
- Sửa lỗi nghiêm trọng: layout gốc + nhiều trang công khai/quản trị bị ghi đè nhầm nội dung, database chưa đồng bộ schema

## Phase 2 (v0.13.0) — Hoàn thành

### CRM khách hàng
- Model `Customer` mới (tên, SĐT — khoá duy nhất, email, công ty, địa chỉ, ghi chú, nguồn khách hàng)
- `QuoteRequest` có thêm `customerId` (tuỳ chọn) để liên kết báo giá với hồ sơ khách hàng
- CRUD đầy đủ: `/admin/customers` (danh sách + tìm kiếm + số báo giá + tổng giá trị), `/admin/customers/new`, `/admin/customers/[id]` (hồ sơ + sửa + lịch sử báo giá)
- Báo giá cũ (trước khi có CRM) vẫn hiển thị trong lịch sử khách hàng nhờ đối chiếu theo số điện thoại — không cần migrate dữ liệu cũ
- Nút "Tạo báo giá cho khách này" ngay tại hồ sơ khách hàng, tự điền sẵn thông tin

### Banner trang chủ
- Banner (đã có CMS từ trước) nay hiển thị thật trên trang chủ công khai, tự ẩn nếu chưa có banner nào đang bật

### SEO
- `app/sitemap.ts` — sitemap động, tự thêm mọi sản phẩm/dự án đã công khai
- `app/robots.ts` — chặn `/admin`, `/api`, trỏ đến sitemap
- `generateMetadata` riêng cho từng trang chi tiết sản phẩm và dự án (title, description, Open Graph theo đúng nội dung từng trang)
- Metadata riêng cho trang danh sách sản phẩm và dự án

## Chưa làm (còn lại)

- Thiết kế lại các trang `/lien-he`, `/bang-gia`, `/phan-mem`, `/so-sanh` theo đúng bố cục mockup premium (hiện đã cùng tông màu nhưng chưa cùng bố cục với trang chủ)
- JSON-LD structured data cho sản phẩm (schema.org Product) — có thể làm thêm nếu cần tối ưu SEO sâu hơn
- Liên kết CRM sâu hơn vào `QuoteBuilder` (chọn khách hàng có sẵn ngay khi soạn báo giá, thay vì chỉ tạo từ trang hồ sơ khách hàng)

## Đã hoàn thành toàn bộ 3 phase ban đầu

Xem chi tiết từng phase ở các mục phía trên. Các việc còn lại (nếu muốn làm tiếp) nằm ở mục "Chưa làm (còn lại)" bên trên, và các gợi ý mở rộng trong `API-CATALOG.md` (mục "Lộ trình tiếp theo").
