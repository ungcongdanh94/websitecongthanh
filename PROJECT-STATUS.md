# PROJECT STATUS — v0.12.0

## Đã sửa lỗi nghiêm trọng (trước khi làm tính năng mới)

- **`app/layout.tsx`** bị ghi đè bằng nội dung của `app/admin/layout.tsx` → mất toàn bộ CSS/Tailwind và lộ menu quản trị trên trang công khai. Đã khôi phục.
- **`app/page.tsx`, `app/san-pham/page.tsx`, `app/du-an/page.tsx`** và toàn bộ khu quản trị (`dashboard`, `quotes`, `products`, `projects` + API tương ứng) bị trùng lặp nội dung do lỗi từ một commit cũ ("Fix v0.11 folder structure"). Đã khôi phục/viết lại toàn bộ, xác nhận không còn file trùng lặp trong `app/`, `components/`, `lib/`.
- **Database drift**: `dealerPrice` và nhiều cột khác (v0.9–v0.11) chưa được `prisma db push` — đã đồng bộ.
- **Lỗi in báo giá**: trang `/admin/quotes/[id]/print` dùng thẻ `<header>`/`<footer>` bị CSS in ấn toàn cục ẩn đi → in ra mất logo và phần chữ ký. Đã sửa (đổi sang `<div>`).
- **Lỗi CMS sản phẩm**: API tạo sản phẩm mới bỏ sót trường `description` (chỉ lưu `shortDesc`). Đã sửa.

## Phase 1 — Hoàn thành

- **Bộ lọc sản phẩm nâng cao**: thêm lọc theo khoảng giá (`minPrice`/`maxPrice`), sắp xếp (mới nhất / giá tăng / giá giảm / tên A-Z), và **phân trang** (12 sản phẩm/trang) cho `/san-pham`.
- **CMS sản phẩm — thư viện ảnh**: trường `gallery` (đã có sẵn trong schema nhưng chưa dùng) nay được quản lý qua `GalleryPicker` mới trong form thêm/sửa sản phẩm, và hiển thị dạng gallery có thumbnail trên trang chi tiết sản phẩm (`ProductGallery`).
- **Bảng giá — Import/Export Excel thật**: xuất file `.xlsx` (trước đây là CSV giả danh Excel), và **nhập giá hàng loạt từ file Excel/CSV** — khớp theo SKU (hoặc tên sản phẩm), tự động ghi lịch sử vào `PriceChange`, báo cáo dòng nào bị bỏ qua và lý do.
- **Báo giá PDF chuyên nghiệp**: tính năng này thực ra đã tồn tại sẵn (letterhead, bảng chi tiết, tổng tiền, chữ ký) — chỉ bị lỗi ẩn nhầm khi in như trên, nay đã in đúng và đầy đủ.

## Đã có từ trước (xác nhận qua audit, không đổi)

- PostgreSQL + Prisma, Cloudinary Media Manager
- CMS: sản phẩm, danh mục, thương hiệu, dự án, banner
- Quản lý bảng giá + lịch sử giá (`PriceChange`)
- Catalog API công khai cho plugin (`/api/catalog/products`)
- Báo giá: tính VAT, chiết khấu, in A4/PDF

## Tiếp theo (Phase 2)

1. CRM khách hàng (model `Customer` mới + lịch sử liên hệ/báo giá theo khách hàng)
2. Hiển thị `Banner` (đã có CMS, chưa render) lên trang chủ công khai
3. SEO: `generateMetadata` theo từng trang/sản phẩm, `sitemap.xml`, `robots.txt`, Open Graph
4. Thiết kế lại các trang còn lại (`/lien-he`, `/bang-gia`, `/phan-mem`, `/so-sanh`) theo mockup premium

## Phase 3 (sau)

- Hoàn thiện `/api/catalog/products` cho plugin SketchUp: phân trang, ảnh gallery, API key/rate-limit, tài liệu API
