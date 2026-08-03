# CHANGELOG

## v0.13.0 — Phase 2: CRM khách hàng, Banner trang chủ, SEO

### ✨ Tính năng mới

- **CRM khách hàng**: thêm model `Customer` (schema mới — xem bên dưới), thêm `customerId` tuỳ chọn vào `QuoteRequest`. Trang quản trị `/admin/customers` (danh sách + tìm kiếm), `/admin/customers/new`, `/admin/customers/[id]` (hồ sơ, sửa thông tin, lịch sử báo giá — kể cả báo giá cũ trước khi có CRM, đối chiếu theo số điện thoại). Nút tạo báo giá nhanh ngay từ hồ sơ khách hàng.
- **Banner trang chủ**: dữ liệu `Banner` (đã có CMS từ trước nhưng chưa từng hiển thị) nay được render thật trên trang chủ công khai.
- **SEO**: thêm `app/sitemap.ts` (sitemap động, tự cập nhật theo sản phẩm/dự án công khai), `app/robots.ts`, và `generateMetadata` riêng cho từng trang chi tiết sản phẩm/dự án (title, description, Open Graph) thay vì dùng chung 1 metadata tĩnh cho toàn site.

### 🗄️ Schema mới (cần chạy `prisma db push`)

```prisma
model Customer {
  id        String         @id @default(cuid())
  name      String
  phone     String         @unique
  email     String?
  company   String?
  address   String?
  note      String?
  source    String?
  quotes    QuoteRequest[]
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  @@index([phone])
}
```
Và thêm vào `QuoteRequest`: `customerId String?` + quan hệ `customer Customer? @relation(...)`. Đây là cột **tuỳ chọn (nullable)** nên không ảnh hưởng báo giá cũ.

---

## v0.12.0 — Sửa lỗi nghiêm trọng + Phase 1 hoàn thành

### 🔴 Sửa lỗi nghiêm trọng

- **`app/layout.tsx`** bị ghi đè bằng nội dung của `app/admin/layout.tsx` (không nạp `globals.css`, không có `Header`/`Footer`) → toàn bộ site mất CSS và hiện menu quản trị trên trang công khai. Đã khôi phục layout gốc đúng (font tiếng Việt, Tailwind, `Header`/`Footer`).
- **`app/page.tsx`, `app/san-pham/page.tsx`, `app/du-an/page.tsx`** và toàn bộ khu quản trị (`app/admin/page.tsx`, `app/admin/quotes/page.tsx`, `app/admin/products/page.tsx`, `app/admin/products/[id]/page.tsx`, `app/admin/projects/page.tsx`) cùng các API tương ứng (`app/api/admin/quotes/route.ts`, `app/api/admin/projects/route.ts`, `app/api/admin/prices/route.ts`) bị trùng lặp nội dung do lỗi từ commit "Fix v0.11 folder structure and quotation module". Đã khôi phục/viết lại toàn bộ dựa trên các component form vốn không bị ảnh hưởng.
- **Database drift**: các cột `dealerPrice`, `productLine`, `aluminumSystem`, `color`, `thickness`, `stockLength`, `catalogUrl`, `videoUrl`, bảng `PriceChange`, các cột mở rộng của `QuoteRequest`/`QuoteItem` (thêm ở v0.9–v0.11) chưa từng được đồng bộ vào database production. Đã chạy `prisma db push --accept-data-loss` (an toàn — chỉ thêm cột/bảng mới, không có dữ liệu trùng).
- **CMS sản phẩm**: route tạo sản phẩm mới (`POST /api/admin/products`) bỏ sót trường `description`, chỉ lưu `shortDesc`. Đã bổ sung.
- **In báo giá PDF**: `app/admin/quotes/[id]/print/page.tsx` dùng thẻ `<header>`/`<footer>` cho letterhead và chữ ký, bị đè bởi CSS in ấn toàn cục (`header, footer { display: none !important; }` trong `globals.css`, vốn dùng để ẩn thanh điều hướng site khi in) → in ra mất logo công ty và phần chữ ký. Đã đổi các thẻ này sang `<div>`.

### ✨ Phase 1 — Tính năng mới

- **Bộ lọc sản phẩm nâng cao** (`/san-pham`): thêm lọc theo khoảng giá (`minPrice`, `maxPrice`), 4 kiểu sắp xếp (mới nhất, giá tăng dần, giá giảm dần, tên A→Z), và phân trang 12 sản phẩm/trang với thanh điều hướng trang.
- **Thư viện ảnh sản phẩm**: trường `gallery` (`Json?`) đã có sẵn trong schema từ trước nhưng chưa được dùng ở đâu. Thêm component `GalleryPicker` (chọn nhiều ảnh từ Media Manager) vào form thêm/sửa sản phẩm, và `ProductGallery` (ảnh chính + dải thumbnail bấm để xem) ở trang chi tiết sản phẩm công khai.
- **Import/Export Excel cho bảng giá**: nâng cấp từ xuất file CSV (giả danh Excel) lên xuất **file `.xlsx` thật** bằng thư viện `xlsx`. Thêm chức năng **nhập giá hàng loạt từ file Excel/CSV** — khớp sản phẩm theo SKU (hoặc tên nếu thiếu SKU), chỉ cập nhật các cột có giá trị trong file, tự động ghi lịch sử vào bảng `PriceChange`, và báo cáo rõ dòng nào bị bỏ qua kèm lý do.

### Dependency mới

- `xlsx@0.18.5` — đọc/ghi file Excel cho tính năng import/export bảng giá.

---

## Trước v0.12.0

Xem lịch sử qua `git log` — không có `CHANGELOG.md` trước phiên bản này.
