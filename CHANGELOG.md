# CHANGELOG

## v0.19.0 — Sprint: Homepage polish + trang Giới thiệu mới

Tuân thủ đúng yêu cầu "KHÔNG REFACTOR" — chỉ bổ sung, không đổi route/API/CMS/schema hiện có.

### ✨ Sprint 1 — Hoàn thiện Homepage

- Thêm tiêu đề **"Vì sao chọn CÔNG THẢNH"** cho khối 4 lý do (trước đây không có tiêu đề, hiện ra đột ngột giữa trang).
- Hero HD, bỏ banner khuyến mãi lớn, section "Giải pháp theo không gian" — **đã làm ở bản trước (v0.18.0)**, không lặp lại.

### ✨ Sprint 2 — Trang Giới thiệu mới (`/gioi-thieu`)

Trang hoàn toàn mới, không đụng route/dữ liệu nào đang có:
- Hero (dùng lại ảnh HD đã có, không tạo ảnh mới)
- Giới thiệu công ty, lịch sử hình thành (tính từ `foundedDate` trong `company-content.json` — 2005)
- Tầm nhìn, sứ mệnh, 4 giá trị cốt lõi
- Lĩnh vực hoạt động (lấy đúng từ `businessScope` đã có trong `company-content.json`, không bịa thêm)
- Năng lực (dùng lại đúng số liệu đang hiển thị ở trang chủ — không tạo số liệu mới)
- Showroom & kho (dùng lại 2 ảnh category đã có, ghi chú minh hoạ — chưa có ảnh thật)
- Đối tác (query trực tiếp bảng `Brand` có sẵn — không tạo dữ liệu mới)
- CTA về `/lien-he`

### 🔧 Lỗi thật được phát hiện qua kiểm tra kỹ hơn

Lần này môi trường của mình tình cờ có sẵn `node_modules` + TypeScript compiler (từ lần Zen gửi source trước đó), nên chạy được `tsc --noEmit` thật — phát hiện 1 lỗi kiểu dữ liệu thật trong `app/api/admin/prices/export/route.ts`: `Buffer` không khớp kiểu `BodyInit` của `Response`. Đã sửa bằng cách bọc `new Uint8Array(buffer)`. Lỗi này có khả năng làm `next build` báo lỗi TypeScript — **đã sửa trước khi Zen build**.

> Lưu ý: `node_modules` trong môi trường mình bị cũ hơn schema hiện tại (chưa có `Customer`, `ApiKey`, `Banner.slug`) nên các lỗi liên quan đến chúng khi chạy `tsc` ở đây là **báo động giả**, không phải lỗi thật — code Zen build sau khi `npm install` + `npx prisma generate` đầy đủ sẽ không gặp các lỗi đó.

### Chưa làm (còn lại trong sprint, theo đúng thứ tự đã liệt kê)

3. Hoàn thiện Products (Gallery đã có từ Phase 1, còn thiếu: Related Products, FAQ, Download Catalogue/PDF)
4. Hoàn thiện Projects (Filter, Gallery đầy đủ)
5. Brands landing page riêng
6. Trang Services (Nhôm thanh / Phụ kiện / Gia công / Sơn tĩnh điện / Nội thất nhôm)
7. Contact: Google Maps
8. SEO: Open Graph đầy đủ hơn, canonical
9. Performance: rà soát lazy-load cho ảnh không phải hero

---

## v0.18.2 — Thêm link công cụ Song Bảo Vệ Nhôm vào trang phần mềm

Thêm mục "Đang sử dụng" ở `/phan-mem` với link thật tới `songbaove.up.railway.app` (công cụ Song Bảo Vệ Nhôm).

## v0.18.1 — Sửa lỗi build do generateMetadata truy vấn DB lúc build

Thêm `export const dynamic = "force-dynamic"` vào `app/layout.tsx` — cùng nguyên nhân/cách sửa như lỗi `sitemap.ts` trước đó.


## v0.18.0 — Tích hợp Premium Assets v2 + audit ảnh

### 🔍 Audit trước khi sửa (yêu cầu #1)

Đã kiểm tra từng ảnh trong gói asset mới bằng mắt (không chỉ theo tên file):

- **`hero/`, `categories/`** (5 ảnh): sạch, không chữ/logo, độ phân giải tốt (1920×1080, 1080×1350, 1200×800) — **dùng trực tiếp**.
- **`solutions/`** (6 ảnh): **có chữ in sẵn** (VD "BIỆT THỰ", "KHÁCH SẠN" ở góc dưới trái) — vi phạm đúng yêu cầu "không chèn chữ vào ảnh". Cách xử lý: đặt tiêu đề HTML ở khối riêng **dưới ảnh** (không đè lên ảnh) để không bị chồng chữ với chữ có sẵn trong ảnh.
- **`projects/`** (5 ảnh): **bị mờ + có viền bo góc/lỗi render** giống ảnh preview thumbnail bị nén lại — **không dùng**. Ngoài ra 3/5 tên file (`project-villa`, `project-hotel`, `project-showroom`) **trùng tên** với ảnh đang dùng thật cho 4 dự án đã seed trước đây (chất lượng tốt hơn) — nếu chép đè sẽ làm giảm chất lượng ảnh dự án hiện có. **Đã giữ nguyên ảnh dự án cũ, không đụng vào.**
- `brand/premium-design-reference.webp`: ảnh tham khảo phong cách thiết kế, không phải asset để gắn vào trang — không sử dụng.

### ✨ Đã thay

- **Hero responsive theo thiết bị**: desktop dùng `hero-home-desktop.webp`, mobile dùng `hero-home-mobile.webp` (2 ảnh riêng, không phải resize từ 1 ảnh) — chuyển bằng class Tailwind `lg:hidden` / `hidden lg:block`, không dùng `<picture>` thô vì `next/image` không hỗ trợ trực tiếp. Chiều cao: mobile `min-h-[650px]`, desktop `min-h-[720px]` (đúng khoảng 620–760px yêu cầu).
- **3 ảnh danh mục**: cập nhật `data/seed-data.json` để dùng `category-aluminum/hardware/interior.webp`. Card đổi từ layout ảnh-vuông-viền-padding sang ảnh-tỉ-lệ-4:3-full-card + tên bên dưới. Grid đổi đúng theo yêu cầu: **1 cột mobile / 2 cột tablet / 3 cột desktop** (trước đây là 2/3/6 — sai yêu cầu).
- **Section mới "Giải pháp theo không gian"**: 6 card (Biệt thự, Nhà phố, Căn hộ, Văn phòng, Khách sạn, Resort) dùng ảnh `solutions/`, tiêu đề render bằng HTML ở khối dưới ảnh (không đè lên ảnh có chữ sẵn). Hover chỉ zoom nhẹ ảnh, không làm mờ/tối thêm.
- **Bỏ khối khuyến mãi lớn**: xoá hoàn toàn section "Khuyến mãi đang diễn ra" (lưới 6 ảnh kiểu sàn TMĐT). Thay bằng **1 dòng chữ nhỏ** ("Ưu đãi lắp đặt đang áp dụng theo khu vực...") gắn ngay trong khối CTA cuối trang đã có — không tạo section riêng, không dùng ảnh.
- **`sizes` cho mọi ảnh `fill`**: thêm đúng theo breakpoint (trước đây một số ảnh `fill` thiếu `sizes`, khiến `next/image` tải ảnh to hơn cần thiết).

### 🧹 Dọn dẹp

Xóa biến `promotions`/`promotionTitles` không còn dùng sau khi bỏ section khuyến mãi (tránh cảnh báo biến chết khi build).

### ✅ Đã xác nhận (yêu cầu #7, #8)

- Không có chỗ nào viết sai "CÔNG THÀNH" (đã grep toàn bộ `app/`, `components/`, `data/` — sạch).
- `next.config.mjs`: đã đúng cấu hình (Cloudinary + Unsplash trong `remotePatterns`, `output: "standalone"`, không có `assetPrefix`/`basePath` sai) — không cần sửa.
- Section thương hiệu (brand) đã tự động dùng text tạm khi chưa có `logoUrl` — không cần sửa thêm.

### Không có thay đổi schema, không có dữ liệu dự án giả mới

Đúng yêu cầu: không tạo dự án mẫu mới, không đổi schema.

---

## v0.17.0 — Dọn các việc còn tồn đọng

### ✨ Tính năng mới

- **CRM nối vào soạn báo giá**: `QuoteBuilder` giờ có dropdown "chọn khách hàng có sẵn từ CRM" — chọn xong tự điền tên/SĐT/email/công ty/địa chỉ và gắn `customerId`, không cần gõ tay nữa. Vẫn có thể gõ tay như trước nếu khách chưa có trong CRM.
- **JSON-LD cho sản phẩm**: trang chi tiết sản phẩm (`/san-pham/[slug]`) giờ có structured data (`schema.org/Product`) — tên, giá, thương hiệu, tình trạng còn hàng — giúp Google có thể hiện giá/thông tin sản phẩm ngay trên kết quả tìm kiếm.
- **Bảng `Setting` đã có tác dụng thật**: trang chủ giờ đọc title/description SEO từ `Setting` (key `seo`, đã seed từ `seo-content.json`) thay vì chỉ để trong database mà không dùng. Có fallback an toàn nếu chưa seed hoặc lỗi kết nối.
- **`/so-sanh` (so sánh sản phẩm) viết lại hoàn toàn**: trước đây đọc từ file tĩnh `data/products.ts` (không đồng bộ với CMS) — giờ đọc **sản phẩm thật từ database**, cho chọn tối đa 4 sản phẩm bất kỳ để so sánh (trước đây cố định 3 sản phẩm đầu tiên), so sánh cả các thông số kỹ thuật (`specs`) thay vì chỉ vài trường cố định.

### 🧹 Dọn dẹp mã chết

- Xóa `components/ProductExplorer.tsx` — **không được import ở đâu cả**, hoàn toàn không dùng.
- Xóa `components/ProductCard.tsx` — chỉ được dùng bởi `ProductExplorer` (đã xóa).
- Xóa `data/products.ts` — dữ liệu tĩnh không còn nơi nào tham chiếu sau khi viết lại `/so-sanh`.

### 📝 SEO — bổ sung metadata còn thiếu

Thêm `title`/`description` cho `/lien-he`, `/bang-gia`, `/phan-mem` (trước đây 3 trang này dùng chung metadata mặc định của toàn site).

### Không có thay đổi schema

`customerId` trên `QuoteRequest` đã có sẵn từ Phase 2 — không cần `prisma db push` lần này.

---

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
