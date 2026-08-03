# CHANGELOG

## v0.15.0 — Phase 3: Chuẩn hóa API cho plugin SketchUp

### ✨ Tính năng mới

- **Xác thực API key**: model `ApiKey` mới (schema — xem bên dưới). Trang quản trị `/admin/api-keys` để tạo/thu hồi/xóa key. `GET /api/catalog/products` giờ bắt buộc header `x-api-key`, trả `401` nếu thiếu hoặc key không hợp lệ/đã thu hồi.
- **Rate limit**: giới hạn 60 request/phút cho mỗi API key (in-memory, phù hợp 1 instance Railway hiện tại). Vượt quá trả `429` kèm header `Retry-After`.
- **Phân trang**: thêm `page`, `pageSize` (mặc định 50, tối đa 100) cho `/api/catalog/products`, response có `total`, `totalPages`, `hasMore`.
- **Ảnh gallery**: response catalog giờ có thêm trường `gallery` (mảng ảnh chi tiết) và `catalogUrl`, ngoài `imageUrl` như trước.
- **Tài liệu API**: `API-CATALOG.md` — đầy đủ endpoint, auth, rate limit, tham số, ví dụ `curl`, mẫu response, và lưu ý bảo mật (không trả `dealerPrice`).

### 🗄️ Schema mới (cần chạy `prisma db push`)

```prisma
model ApiKey {
  id         String    @id @default(cuid())
  key        String    @unique
  label      String
  isActive   Boolean   @default(true)
  lastUsedAt DateTime?
  createdAt  DateTime  @default(now())

  @@index([key])
}
```

---

## v0.14.0 — Tích hợp asset thật + seed dữ liệu thật

### ✨ Thay đổi

- **Logo thật**: `Header.tsx` dùng `/assets/logos/logo-cong-thanh-color.png` (nền sáng), `Footer.tsx` dùng `/assets/logos/logo-cong-thanh-white.png` (nền xanh đậm) — thay cho ô chữ "CT" placeholder trước đây.
- **Hero trang chủ**: dùng ảnh thật `/assets/banners/hero-homepage.webp` làm nền, thay cho minh hoạ SVG. Bỏ khối mặt cắt nhôm giả (không còn cần thiết khi đã có ảnh thật), giữ lại thẻ "Quy trình đặt hàng".
- **Khối quảng bá (promotions)**: thêm mục "Khuyến mãi đang diễn ra" trên trang chủ, hiển thị 6 ảnh trong `/assets/promotions`, đọc đường dẫn trực tiếp từ `data/site-assets.json` (không hard-code lại đường dẫn).
- **`prisma/seed.ts` viết lại toàn bộ**:
  - Đọc dữ liệu từ `data/site-assets.json` (ảnh) và `data/brand-content.json` (nội dung hero) thay vì hard-code.
  - Upsert 3 danh mục, 6 thương hiệu, 6 sản phẩm (đã có `imageUrl` thật; sản phẩm CMECH có thêm `gallery` — dùng luôn tính năng gallery từ Phase 1), 4 dự án (ảnh thật), và 1 banner trang chủ.
  - Toàn bộ dùng `upsert` theo slug ổn định — **chạy lại nhiều lần không tạo trùng, không xoá dữ liệu đang có**.
  - Ghi chú rõ trong code: sản phẩm CANDY và DRAHO chưa có ảnh chụp riêng nên tạm dùng ảnh phụ kiện CMECH làm ảnh mặc định.

### 🗄️ Schema mới (cần chạy `prisma db push`)

Thêm `slug String? @unique` vào model `Banner` — cần thiết để `seed.ts` có thể `upsert` banner một cách ổn định (Banner trước đây không có khoá duy nhất nào ngoài `id` tự sinh). Cột này **tuỳ chọn (nullable)** nên các banner đã tạo qua CMS trước đây không bị ảnh hưởng.

### 📦 Việc cần làm sau khi deploy

Ngoài `prisma db push`, lần này cần chạy thêm:
```
npm run db:seed
```
để nạp dữ liệu mẫu (sản phẩm, dự án, banner) có ảnh thật vào database.

---

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
