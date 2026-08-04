# CHANGELOG

## v0.16.2 — Quay lại Claude (Anthropic)

Đổi lại từ OpenAI về **Anthropic Claude Haiku 4.5** ($1/$5 mỗi triệu token — rẻ hơn cả GPT-5.6 Luna không đáng kể, nhưng Zen đã có sẵn API key Anthropic từ trước nên tiện hơn). Biến môi trường quay lại **`ANTHROPIC_API_KEY`**.

> Lưu ý đã phát hiện ở bước trước: nếu sau này đổi qua OpenAI lại, KHÔNG dùng model string `"gpt-5.6"` trơn — nó trỏ tới bản Sol (đắt nhất, $5/$30). Nên dùng `"gpt-5.6-luna"` ($0.20/$1.20) cho việc chat tư vấn ngắn như thế này.

---

## v0.16.1 — Đổi trợ lý AI sang OpenAI (ChatGPT)

- `app/api/ai-advisor/route.ts`: đổi từ gọi Anthropic Claude sang **OpenAI Chat Completions API** (`gpt-5.6` — model khuyến nghị hiện tại của OpenAI cho production, có thể đổi qua hằng số `MODEL` trong file).
- Biến môi trường đổi từ `ANTHROPIC_API_KEY` sang **`OPENAI_API_KEY`**.
- Logic ràng buộc AI (chỉ tư vấn sản phẩm thật trong DB, không bịa giá...) giữ nguyên như trước — chỉ đổi nhà cung cấp, không đổi hành vi.

### ⚠️ Cần đổi biến môi trường trên Railway

Xoá `ANTHROPIC_API_KEY` (nếu đã thêm), thêm `OPENAI_API_KEY` = key OpenAI thật của Zen.

---

## v0.16.0 — Trợ lý AI tư vấn (tính năng thật, gọi Claude thật)

### ✨ Tính năng mới

- **`app/api/ai-advisor/route.ts`**: endpoint công khai gọi Anthropic Claude (`claude-haiku-4-5-20251001`), có context là **danh sách sản phẩm thật đang PUBLISHED trong database** (tên, danh mục, thương hiệu, hệ nhôm, giá, link chi tiết). AI được yêu cầu **chỉ giới thiệu sản phẩm có trong danh sách này**, không bịa sản phẩm/giá.
- **`components/AiAdvisorWidget.tsx`**: khung chat nổi ở góc phải màn hình, hiển thị trên mọi trang công khai (ẩn ở `/admin`), có lịch sử hội thoại, trạng thái đang trả lời.
- Gắn vào `app/layout.tsx` để hiện xuyên suốt toàn site.
- **Rate limit**: 60 request/phút/IP (dùng lại `lib/rateLimit.ts` từ Phase 3) để tránh bị lạm dụng gây tốn phí API.

### ⚠️ Bắt buộc phải làm trước khi tính năng chạy được

Thêm biến môi trường **`ANTHROPIC_API_KEY`** trên Railway (Variables của service web) — Zen đã có key Anthropic sẵn theo xác nhận trước đó. Thiếu biến này, khung chat vẫn hiện nhưng sẽ báo "Trợ lý AI chưa được kích hoạt" thay vì lỗi trắng trang.

### 🧠 Nguyên tắc đã cài vào AI (system prompt)

- Chỉ tư vấn trong phạm vi nhôm/phụ kiện cửa/nội thất nhôm — từ chối lịch sự nếu hỏi ngoài phạm vi
- Không bịa sản phẩm, thương hiệu, giá không có trong database
- Sản phẩm chưa có giá công khai → trả lời "giá liên hệ", mời khách để lại số điện thoại
- Luôn kèm link `/san-pham/slug` khi giới thiệu sản phẩm cụ thể

---

## v0.15.2 — Tích hợp Content & Seed Pack (SKU, mô tả chi tiết, cài đặt nội dung)

### ✨ Thay đổi

- **`prisma/seed.ts` viết lại lần nữa**, gộp dữ liệu từ content pack mới (`data/seed-data.json`, `data/company-content.json`, `data/site-content.json`, `data/seo-content.json`):
  - Sản phẩm giờ có **SKU thật** (VD: `XFA-55`, `CMECH-DOOR`) và **mô tả chi tiết đầy đủ** (trước chỉ có placeholder).
  - Danh mục có ảnh minh hoạ riêng; thương hiệu Candy/Draho để `logoUrl: null` (trung thực — chưa có logo thật, không còn dùng tạm ảnh CMECH như bản trước).
  - Banner: sửa lại toàn bộ dùng **slug ổn định** (`trang-chu-hero`, `khuyen-mai-xingfa-class-a`, `khuyen-mai-noi-that-nhom`) để upsert an toàn — bản gốc trong content pack đối chiếu theo `title` (dễ tạo trùng nếu đổi tiêu đề sau này).
  - Thêm bảng `Setting` (đã có sẵn trong schema, chưa từng dùng) lưu nội dung công ty/trang chủ/SEO dạng key-value — **chuẩn bị cho việc dùng dần**, hiện các trang vẫn hiển thị nội dung tĩnh như cũ.

### 🔧 Đã sửa đường dẫn sai trong content pack gốc

Content pack gửi kèm tham chiếu `hero.image` và banner đầu tiên tới `hero-homepage.webp` — **ảnh cũ có chữ/logo nhúng sẵn đã bị thay ở v0.15.1**. Đã sửa cả 2 chỗ này sang `hero-homepage-v2.webp` trước khi tích hợp.

### ⏭️ Đã bỏ qua có chủ đích

Content pack có kèm 2 "dự án mẫu" (trạng thái `DRAFT`, ảnh minh hoạ, theo README là placeholder cần thay ảnh thật trước khi công khai). Vì đã có 4 dự án thật (`PUBLISHED`, ảnh thật, tên/địa điểm cụ thể) từ trước, seed lần này **chủ động không thêm 2 dự án mẫu đó** để tránh trộn dữ liệu placeholder vào trang công khai.

### 📌 Việc cần làm thủ công (theo README của content pack)

- Cập nhật hotline và email chính thức (hiện đang để trống/`null`)
- Cập nhật giá bán thật cho sản phẩm (seed không tự tạo giá)
- Bổ sung catalogue, video kỹ thuật cho sản phẩm

---

## v0.15.1 — Sửa lại toàn bộ Hero trang chủ

### 🔧 Thay đổi

- **Ảnh hero**: đổi từ `hero-homepage.webp` (ảnh crop từ asset board, có chữ/logo nhúng sẵn) sang đường dẫn mới `hero-homepage-v2.webp` — **cần Zen bổ sung ảnh thật** (≥1920×1080, không chữ, không logo). Cùng đường dẫn này cũng được cập nhật trong `prisma/seed.ts` cho banner trang chủ, để đồng bộ cả hai nơi dùng ảnh hero.
- **`next/image`**: thêm đầy đủ `quality={90}`, `sizes="100vw"` (trước đây thiếu 2 thuộc tính này).
- **Overlay**: đổi từ gradient nhuộm màu xanh lá (`from-brand-950 via-brand-950/85 to-brand-950/30`) sang đúng `from-black/75 via-black/45 to-transparent` như yêu cầu.
- **Kích thước heading**: mobile `36px` → `42px` (`sm:`), desktop `60px` (`lg:`) — nằm trong khoảng 56–64px yêu cầu.
- **Bố cục**: nội dung trái giới hạn `max-w-[680px]`; card quy trình bên phải `max-w-[460px]` và `lg:w-[38%]` (dưới 40%).
- **Responsive**: đổi từ `grid lg:grid-cols-[...]` (card ẩn hoàn toàn trên mobile — `hidden lg:flex`) sang `flex flex-col lg:flex-row` — mobile giờ xếp 1 cột, card quy trình hiển thị **dưới** nội dung (trước đây bị ẩn hẳn trên mobile).

### ✅ Ảnh hero đã được bổ sung

`public/assets/banners/hero-homepage-v2.webp` — ảnh biệt thự hiện đại do Zen cung cấp, đã resize đúng 1920×1080 (ảnh gốc 1672×941, tỉ lệ khung hình gần như giữ nguyên nên không bị méo khi resize).

---

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
