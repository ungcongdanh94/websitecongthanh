# PROJECT STATUS — v0.13.0

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

## Phase 3 (sau)

- Hoàn thiện `/api/catalog/products` cho plugin SketchUp: phân trang, ảnh gallery, API key/rate-limit, tài liệu API
