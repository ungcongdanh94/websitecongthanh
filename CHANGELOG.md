# CHANGELOG

## v0.35.1 — Sửa lỗi build: node:crypto lọt vào bundle client

### 🔴 Lỗi thật, làm build gãy hoàn toàn

`lib/cloudinary.ts` có dùng `node:crypto` (để ký request upload/xóa ảnh — chỉ chạy được ở server). Ở Sprint E, mình lỡ import `optimizeImageUrl` từ đúng file đó vào `ProductGallery.tsx` và `DatabaseProductCard.tsx` — cả 2 đều là **client component**. Kết quả: webpack cố đóng gói `node:crypto` vào bundle chạy trên trình duyệt → `UnhandledSchemeError`, build gãy hoàn toàn.

### ✅ Đã sửa

Tách `normalizeLogoUrl` và `optimizeImageUrl` (chỉ xử lý chuỗi URL, không cần crypto) ra file mới **`lib/cloudinaryUrl.ts`** — an toàn dùng ở cả client và server. `lib/cloudinary.ts` giờ chỉ còn các hàm thật sự cần chạy ở server (`uploadImage`, `destroyImage`).

### File thay đổi
`lib/cloudinary.ts`, `lib/cloudinaryUrl.ts` (mới), `app/page.tsx`, `app/gioi-thieu/page.tsx`, `components/DatabaseProductCard.tsx`, `components/ProductGallery.tsx` (chỉ đổi đường import, không đổi logic).

---

## v0.35.0 — Sprint E: SEO/Performance

Audit trước: dynamic metadata, canonical, sitemap, robots.txt, Product schema, Open Graph, alt text (đã kiểm tra kỹ — mọi `<Image>` đều có `alt`), lazy load (chỉ hero/logo/ảnh chính dùng `priority`) — **tất cả đã có từ trước**, không code lại. Article schema bỏ qua vì model `Article` chưa được dùng ở đâu trong code.

### ✨ Đã thêm

- **Breadcrumb schema** (`BreadcrumbList`): thêm vào trang chi tiết sản phẩm (Trang chủ › Sản phẩm › Danh mục › Tên sản phẩm).
- **FAQ schema** (`FAQPage`): gắn vào đúng khối FAQ đã có sẵn trên trang chi tiết sản phẩm — Google có thể hiện câu hỏi/trả lời ngay trên kết quả tìm kiếm.
- **LocalBusiness schema**: thêm vào `layout.tsx`, hiện trên **mọi trang** — tên công ty, địa chỉ, hotline, dùng đúng dữ liệu đã có trong `company-content.json`.
- **Cloudinary transformation theo đúng kích thước hiển thị**: thêm hàm `optimizeImageUrl()` — card sản phẩm tải ảnh cỡ 600px, ảnh chính trang chi tiết cỡ 900px, thumbnail gallery cỡ 300px (trước đây tải nguyên ảnh gốc cho mọi kích thước hiển thị, tốn băng thông không cần thiết). Tự chọn định dạng nhẹ nhất theo trình duyệt (`f_auto`) và chất lượng vừa đủ (`q_auto`) — không làm ảnh mờ.

### File thay đổi
`lib/cloudinary.ts`, `components/DatabaseProductCard.tsx`, `components/ProductGallery.tsx`, `app/layout.tsx`, `app/san-pham/[slug]/page.tsx`.

Không có thay đổi schema.

---

## v0.34.0 — Sprint D: Lead & Conversion

Audit trước: CTA "Nhận báo giá" ở Product Detail, lưu lead vào CRM (`findOrCreateCustomer`), không làm banner giảm giá lớn/popup — **đã có từ trước**, không code lại.

### 🗄️ Schema mới (cần chạy `prisma db push`)

Thêm `sourceUrl String?` vào `QuoteRequest` — lưu đúng URL trang mà khách đang xem lúc gửi yêu cầu (VD: link sản phẩm cụ thể), giúp biết lead đến từ đâu.

### ✨ Đã thêm

- **Tự điền sản phẩm vào form báo giá**: trước đây nút "Yêu cầu báo giá" ở trang sản phẩm đã link `/lien-he?product=...` nhưng **form chưa từng đọc tham số này** — giờ đã tự điền đúng ô "Sản phẩm quan tâm".
- **Lưu nguồn lead**: mỗi lần gửi form, `sourceUrl` (URL trang hiện tại) được lưu kèm theo — hiện luôn ở trang chi tiết báo giá trong `/admin/quotes/[id]` (link bấm được, mở đúng trang khách đã xem).
- **Floating Zalo/Phone**: 2 nút tròn nhỏ góc dưới-trái (đối diện khung chat AI ở góc dưới-phải để không đè lên nhau) — gọi nhanh hoặc nhắn Zalo, không che nội dung trang, không phải popup.

### File thay đổi
`prisma/schema.prisma`, `lib/validators.ts`, `app/api/quote-requests/route.ts`, `components/QuoteForm.tsx`, `app/lien-he/page.tsx` (thêm Suspense boundary — bắt buộc vì `QuoteForm` giờ dùng `useSearchParams`), `app/admin/quotes/[id]/page.tsx`, `components/FloatingContact.tsx` (mới), `app/layout.tsx`.

---

## v0.33.0 — Sprint C: Product UX

Audit trước: filter Danh mục/Thương hiệu/Hệ nhôm/Khoảng giá, sort tên/giá, đồng bộ query string, Compare Products, Related Products, giá null → "Liên hệ", dealerPrice không public — **tất cả đã có từ trước**, không làm lại. Lần này chỉ làm phần còn thiếu thật:

### ✨ Đã thêm

- **Search realtime + Autocomplete**: ô tìm kiếm ở Header giờ gợi ý sản phẩm ngay khi gõ (debounce 250ms), hiện ảnh + giá, bấm vào đi thẳng tới sản phẩm — không cần Enter hay chờ tải lại trang. Route mới: `app/api/search/suggest/route.ts` (public, giới hạn 6 kết quả).
- **Filter theo Màu và Độ dày**: thêm 2 ô lọc mới ở `/san-pham` — dùng khớp gần đúng (`contains`) vì các field này giờ có thể chứa nhiều giá trị (VD: "Trắng, Ghi xám"), khớp chính xác tuyệt đối sẽ bỏ sót sản phẩm.
- **Recently Viewed**: lưu lịch sử xem bằng `localStorage` (không cần lưu server, riêng theo từng máy/trình duyệt) — trang chi tiết sản phẩm hiện dải "Đã xem gần đây" (tối đa 8 sản phẩm, loại trừ sản phẩm đang xem).

### 🔧 Sửa thêm (phát hiện khi audit)

Header top-bar có dòng **"Bảo hành đến 10 năm"** — số liệu tự bịa từ trước, vi phạm đúng nguyên tắc "không tự tạo thông số" đã thống nhất từ Sprint gần đây (bảo hành giờ để riêng từng sản phẩm, không có số chung). Đã sửa thành câu chung không cam kết số cụ thể.

### File thay đổi
`components/Header.tsx`, `app/api/search/suggest/route.ts` (mới), `lib/recentlyViewed.ts` (mới), `components/RecentlyViewed.tsx` (mới), `app/san-pham/[slug]/page.tsx`, `app/san-pham/page.tsx`.

Không có thay đổi schema.

---

## v0.32.0 — Sprint B hoàn thành: Import Excel + Preview, Rich Text, Gallery kéo-thả

Hoàn thành 3 việc còn lại của Sprint B — Sprint B giờ đã xong toàn bộ 9/9 việc.

### ✨ Import Excel/CSV có Preview (2 bước, an toàn)

- **Bước 1 — Xem trước**: `/admin/products/import`, tải file lên → hệ thống đọc và kiểm tra từng dòng (tên, danh mục có tồn tại không, thương hiệu...) — **chưa ghi gì vào database**, chỉ hiện bảng xem trước với dòng hợp lệ/lỗi rõ ràng.
- **Bước 2 — Xác nhận**: chỉ sau khi Zen bấm "Xác nhận nhập", hệ thống mới ghi các dòng **hợp lệ** vào database (upsert theo slug — sản phẩm đã có sẽ được cập nhật, chưa có sẽ tạo mới).
- File cần cột: SKU, Tên sản phẩm, Slug (tùy chọn), Danh mục (bắt buộc, khớp theo tên hoặc slug đã có), Thương hiệu, Hệ nhôm, Màu, Độ dày, Chiều dài thanh, Đơn vị, Giá bán, Giá đại lý, Mô tả ngắn, Trạng thái.
- Route mới: `app/api/admin/products/import/route.ts` (preview), `app/api/admin/products/import/confirm/route.ts` (ghi dữ liệu).

### ✨ Rich text editor cho mô tả sản phẩm (an toàn, không rủi ro XSS)

Thay ô mô tả từ textarea thường sang **editor có toolbar** (Đậm/Nghiêng/Danh sách/Liên kết) với nút "Xem trước". Cách làm: dùng cú pháp markdown giới hạn (không phải HTML thô) — mọi ký tự HTML trong nội dung đều được escape trước khi áp định dạng, nên **không thể chèn script hay HTML độc hại** dù admin dán nội dung gì vào. Trang chi tiết sản phẩm giờ hiển thị mô tả có định dạng (đậm/nghiêng/danh sách) thay vì chữ thuần.

File mới: `lib/markdown.ts` (renderer an toàn), `components/admin/MarkdownEditor.tsx`.

### ✨ Kéo thả đổi thứ tự ảnh trong Gallery

`GalleryPicker` giờ cho kéo-thả các ảnh đã chọn để đổi thứ tự hiển thị (số thứ tự hiện ngay trên mỗi ảnh). Thứ tự này được lưu đúng theo mảng `gallery` trong database, ảnh đầu tiên vẫn luôn hiện trước trên trang sản phẩm.

### File thay đổi
`app/api/admin/products/import/route.ts`, `app/api/admin/products/import/confirm/route.ts`, `components/admin/ProductImportManager.tsx`, `app/admin/products/import/page.tsx`, `app/admin/products/page.tsx`, `components/admin/GalleryPicker.tsx`, `lib/markdown.ts`, `components/admin/MarkdownEditor.tsx`, `components/admin/ProductForm.tsx`, `components/admin/ProductEditForm.tsx`, `app/san-pham/[slug]/page.tsx`.

Không có thay đổi schema lần này.

---

## v0.31.0 — Sprint B (phần 1): CMS Content Tools

Làm 4/9 việc trong Sprint B gốc — 5 việc còn lại (rich text editor, gallery kéo-thả, import Excel + preview) để làm tiếp lượt sau vì cần cân nhắc kỹ hơn (rich text cần tránh rủi ro XSS, import cần bước preview trước khi ghi DB).

### 🗄️ Schema mới (cần chạy `prisma db push`)

Thêm 3 field SEO riêng cho từng sản phẩm vào `Product`:
```prisma
seoTitle       String?
seoDescription String?
ogImage        String?
```
Đều tùy chọn — để trống sẽ tự dùng tên/mô tả sản phẩm như trước, không ảnh hưởng sản phẩm cũ.

### ✨ Đã thêm

- **SEO title/description/OG image theo từng sản phẩm**: form thêm/sửa sản phẩm có thêm khối SEO riêng; trang chi tiết sản phẩm ưu tiên dùng các field này nếu có, không thì tự tạo như trước.
- **Sao chép sản phẩm** (`Duplicate Product`): nút "Sao chép" ở mỗi dòng trong `/admin/products` — tạo bản sao ở trạng thái **Bản nháp** (an toàn, không tự công khai), slug tự thêm `-copy`, SKU/SEO title để trống (tránh trùng).
- **Bulk publish/unpublish/archive**: `/admin/products` giờ có checkbox chọn nhiều dòng + thanh hành động (Công khai / Chuyển về nháp / Lưu trữ) áp dụng cho tất cả sản phẩm đã chọn cùng lúc.
- **Export Excel đầy đủ cho sản phẩm**: nút "Xuất Excel" mới ở `/admin/products` — xuất toàn bộ field CMS (SKU, slug, danh mục, thương hiệu, hệ nhôm, màu, độ dày, chiều dài, trạng thái, mô tả ngắn...). Khác với "Xuất Excel" ở `/admin/prices` (chỉ tập trung giá) — hai file phục vụ mục đích khác nhau, không trùng lặp thật.
- Component mới dùng chung: `ProductTable.tsx` (client, có checkbox+bulk), `DuplicateProductButton.tsx`.

### Chưa làm (Sprint B còn lại)
- Rich text editor cho mô tả sản phẩm
- Kéo thả thứ tự ảnh trong Gallery
- Import Excel/CSV sản phẩm + bảng giá kèm preview trước khi ghi

---

## v0.30.0 — Sprint A: Nhập lại catalog + chuẩn hóa dữ liệu

Nhập lại 56 sản phẩm thật đã thu thập từ congthanhco.com (bị xóa ở bản trước theo yêu cầu), lần này áp chuẩn hóa Sprint A ngay từ đầu:

- **SKU**: thêm mã SKU cho toàn bộ 56 sản phẩm, sinh có quy tắc theo brand + hệ nhôm (VD: `XF-CLA-A80`, `OD-X6`, `MP-R83`). **Lưu ý**: site gốc congthanhco.com không công khai SKU nào — đây là mã nội bộ mình tự đặt có hệ thống, không phải mã thật của công ty. Zen đổi lại qua `/admin/products` nếu công ty đã có hệ SKU riêng.
- **Slug**: xác nhận toàn bộ 56 slug đều tiếng Việt không dấu, chỉ gồm chữ thường/số/gạch ngang, không trùng lặp.
- **Hệ nhôm/màu/độ dày**: giữ nguyên format đã chuẩn hóa từ trước (VD: `"1.8mm, 2.0mm"` cho nhiều độ dày).
- **Giá**: toàn bộ để `null` → hiển thị "Liên hệ" — đúng thực tế site gốc, không bịa giá.
- **Không seed lại bộ dữ liệu mẫu cũ** (6 sản phẩm demo) — đã bỏ vĩnh viễn từ bản trước, giữ nguyên quyết định đó.

### File thay đổi
`data/congthanh-real-catalog.json` (tạo lại, có thêm SKU), `prisma/seed.ts` (thêm lại `seedRealCatalog()`, có `sku`).

### Chưa làm (Sprint A còn thiếu)
- Chuẩn hóa `Project`, `Article` (Article model chưa được dùng ở đâu trong code — bỏ qua cho tới khi có nhu cầu thật)
- Nhóm "Cửa Sắt - Inox" (~25-29 sản phẩm) vẫn chưa thu thập được (xem lý do ở lượt trước)

---

## v0.29.0 — Xóa sạch dữ liệu sản phẩm/danh mục/thương hiệu

Theo yêu cầu: xóa toàn bộ sản phẩm, danh mục, thương hiệu (cả bộ mẫu cũ và catalog thật vừa nhập từ congthanhco.com).

### ✨ Đã thêm

- **`prisma/clear-catalog.ts`** (script chạy một lần) — xóa an toàn theo đúng thứ tự: gỡ liên kết sản phẩm khỏi các dòng báo giá cũ trước (giữ nguyên báo giá, chỉ bỏ link, không mất dữ liệu báo giá), xóa toàn bộ `Product` (kéo theo `PriceChange` tự xóa), rồi xóa `Category` và `Brand`.
- Thêm lệnh `npm run db:clear-catalog` để chạy script trên.

### 🔧 Đã sửa để không seed lại

**`prisma/seed.ts` được viết lại** — bỏ hẳn phần seed Danh mục/Thương hiệu/Sản phẩm (cả bộ mẫu 6 sản phẩm cũ và 56 sản phẩm thật vừa nhập). Từ giờ `npm run db:seed` **chỉ còn seed Banner, Dự án và Cài đặt nội dung** — không tự tạo lại sản phẩm nữa. Đã xóa file `data/congthanh-real-catalog.json` (không còn dùng tới).

### ⚠️ Kết quả sau khi xóa

Trang chủ và `/san-pham` sẽ hiện **trống** ở các khối Danh mục, Đối tác & thương hiệu, Sản phẩm nổi bật — đây là trạng thái đã lường trước (có sẵn thông báo rỗng phù hợp), không phải lỗi. Menu, CRM, Dự án, Bảng giá và các phần khác không bị ảnh hưởng.

---

## v0.28.0 — Nhập catalog sản phẩm thật từ congthanhco.com (đã xóa ở bản này)

### ✨ Đã thêm

- **`data/congthanh-real-catalog.json`** — dữ liệu thật thu thập trực tiếp từ website `congthanhco.com` qua Research: **56 sản phẩm** (tên, slug, ảnh CDN thật, mô tả, thông số kỹ thuật khi có), gom vào **4 danh mục mới** (Cửa Nhôm, Cửa Kính, Cửa Kéo - Cửa Cuốn, Tủ Nhôm Nội Thất Cánh Kính) và **4 thương hiệu** (Xingfa, MAXPRO JP, ONEDOOR, CTDOOR).
- **`prisma/seed.ts`**: thêm hàm `seedRealCatalog()` độc lập, chạy thêm sau phần seed mẫu cũ — dùng `upsert` theo slug, **không xoá hoặc đụng vào 6 sản phẩm mẫu đã seed trước đó** (2 bộ dữ liệu tồn tại song song, không xung đột vì slug khác nhau hoàn toàn).

### 📌 Giới hạn cần Zen biết

- Đây là **56/85 sản phẩm** thật trên site gốc — nhóm **"Cửa Sắt - Inox"** (~25-29 sản phẩm còn lại) chưa thu thập được vì mục này trên site gốc không có trang danh mục riêng (link trỏ về trang chủ). Cần thu thập riêng nếu muốn đủ 100%.
- Toàn bộ sản phẩm nhập vào đều **chưa có giá** (site gốc để "Liên hệ" cho tất cả) — đúng thực tế, không tự đặt giá.
- Một vài sản phẩm có `shortDesc` để trống (trang danh mục gốc không có mô tả ngắn cho các sản phẩm đó) — Zen có thể bổ sung qua `/admin/products` sau.

---

## v0.27.0 — Tự động căn chỉnh logo về đúng khung chuẩn

Dùng tính năng transformation có sẵn của **Cloudinary** (nơi đang lưu toàn bộ ảnh Media Manager) để tự động xử lý ảnh logo ngay khi hiển thị — không cần chỉnh sửa gì lúc tải ảnh lên:

- Cloudinary tự đọc kích thước ảnh gốc (vuông, ngang, dọc đều được) và co giãn vừa khung chuẩn **400×267 (tỉ lệ 3:2)**, chèn nền trắng vào phần còn thiếu — không cắt mất phần logo, không kéo méo.
- Nhờ vậy, **mọi logo hiện với tỉ lệ nhất quán** dù ảnh gốc Zen tải lên có kích thước/tỉ lệ khác nhau thế nào — khác với trước đây, logo ngang mỏng sẽ hiện nhỏ hơn logo gần vuông dù cùng 1 khung.
- Áp dụng cho khối "Đối tác & thương hiệu" ở trang chủ và trang Giới thiệu (2 nơi đang dùng khung thẻ cố định tỉ lệ). Không đổi database, không cần xử lý lại ảnh đã tải lên trước đó — hoạt động ngay với ảnh cũ.

File thay đổi: `lib/cloudinary.ts` (hàm mới `normalizeLogoUrl`), `app/page.tsx`, `app/gioi-thieu/page.tsx`.

---

## v0.26.1 — Sửa logo thương hiệu hiện quá nhỏ

Khung hiện logo ở trang chủ và trang Giới thiệu đang cố định cao **32px** trong khi khung thẻ rộng hơn nhiều — logo bị "lọt thỏm" giữa khoảng trắng. Đổi sang để logo **lấp đầy khung thẻ theo tỉ lệ 3:2** (dùng `object-contain` nên không bị kéo méo, chỉ scale lớn lên vừa khung). Áp dụng cho khối "Đối tác & thương hiệu" ở trang chủ và trang Giới thiệu — 2 chỗ còn lại (`/thuong-hieu` danh sách và trang chi tiết từng hãng) khung đã đủ lớn từ trước, không cần sửa.

---

## v0.26.0 — Thêm ô chọn Logo cho Thương hiệu

### 🔴 Xác nhận: thiếu tính năng thật

Kiểm tra lại: `logoUrl` **chưa từng được xử lý ở bất kỳ đâu** trong form thêm/sửa thương hiệu, dù trường này đã có sẵn trong database từ đầu. Đây là lý do khối "Đối tác" ở trang chủ luôn hiện tên chữ — không phải lỗi hiển thị, mà vì chưa có cách nào để nhập logo cả.

### ✅ Đã thêm

- Form thêm thương hiệu (`/admin/brands`) và form sửa (`/admin/brands/[id]`) đều có thêm ô **chọn Logo** — dùng lại Media Manager có sẵn (chọn ảnh đã tải lên, không cần tải lại).
- Danh sách thương hiệu hiện thumbnail nhỏ logo (hoặc chữ "Chưa có" nếu chưa chọn) để dễ kiểm tra thương hiệu nào còn thiếu logo.
- Không đổi database — cột `logoUrl` đã có sẵn từ đầu, chỉ là chưa từng dùng tới.

### 📌 Zen cần làm sau khi deploy

Vào `/admin/brands`, bấm "Sửa" từng thương hiệu, chọn logo từ Media Manager (tải logo lên `/admin/media` trước nếu chưa có). Khối "Đối tác" ở trang chủ sẽ tự hiện đúng logo ngay khi Zen chọn xong, không cần thêm bước nào khác.

---

## v0.25.2 — Cho phép tự nhập mã màu chính xác

Trả lời câu hỏi của Zen: **có**, giờ Zen tự đưa màu vào được. Khi nhập màu ở form sản phẩm, thêm mã hex ngay sau tên là hệ thống dùng đúng mã đó, không cần đoán qua bảng tên có sẵn nữa.

Cách nhập: `Trắng #FFFFFF, Ghi xám #9CA3AF, Vân gỗ #8B5E34` — vẫn có thể chỉ nhập tên không kèm mã (VD: `Trắng`) như trước, hệ thống sẽ tự tra bảng màu hoặc dùng xám mặc định nếu không nhận diện được.

Không có thay đổi schema — chỉ đổi cách đọc/hiển thị (`lib/productDisplay.ts`).

---

## v0.25.1 — Sửa lại: bảo hành theo từng sản phẩm + màu sắc hiện vòng tròn

### 🔧 Sửa lại quyết định sai ở bản v0.25.0

Zen phản hồi đúng: 1 thương hiệu có nhiều dòng sản phẩm, mỗi sản phẩm bảo hành khác nhau — **không gộp chung theo thương hiệu được**. Đã revert hoàn toàn field `warrantyPolicy` khỏi `Brand`, chuyển sang **`Product`** (đúng theo từng sản phẩm):

```prisma
// Product
warrantyPolicy String?
```

- Form thêm/sửa sản phẩm giờ có ô "Chính sách bảo hành" riêng cho từng sản phẩm.
- Trang chi tiết sản phẩm hiện đúng bảo hành của sản phẩm đó (không còn ghi kèm tên thương hiệu vì không còn gắn với thương hiệu nữa).
- `/admin/brands` và trang thương hiệu công khai — bỏ lại như cũ, không còn ô bảo hành ở đó.

> Nếu Zen đã chạy `prisma db push` cho bản v0.25.0 trước đó: chạy lại lần này sẽ tự xoá cột `warrantyPolicy` khỏi `Brand` và tạo lại ở `Product` — không ảnh hưởng dữ liệu khác.

### ✨ Màu sắc hiện vòng tròn thay vì chỉ chữ

Thêm bảng màu tên tiếng Việt → mã màu (Trắng, Đen, Ghi xám, Vân gỗ, Vàng đồng...) trong `lib/productDisplay.ts`. Mỗi màu giờ hiện **vòng tròn nhỏ đúng màu + tên chữ bên cạnh** (không bỏ chữ hẳn — vì tên màu như "vân gỗ" cần chữ mới rõ nghĩa, vòng tròn chỉ minh hoạ thêm). Áp dụng cho card sản phẩm và trang chi tiết sản phẩm. Màu không có trong bảng sẽ hiện vòng tròn xám trung tính, vẫn hiện đúng tên chữ.

---

## v0.25.0 — Chính sách bảo hành theo nhà sản xuất (đã sửa lại ở bản trên, xem v0.25.1)

### 🗄️ Schema mới (cần chạy `prisma db push`)

Thêm `warrantyPolicy String?` vào `Brand` — **để ở cấp thương hiệu (nhà sản xuất)**, không phải cấp sản phẩm, vì chính sách bảo hành thường áp dụng chung cho cả một hãng (Xingfa, CMECH...) chứ không khác nhau theo từng sản phẩm riêng lẻ. Nhờ vậy chỉ cần nhập 1 lần cho mỗi thương hiệu, mọi sản phẩm thuộc thương hiệu đó tự động hiện đúng chính sách.

### ✨ Đã thêm

- Trang sửa thương hiệu (`/admin/brands/[id]`) có thêm ô nhập chính sách bảo hành (dạng văn bản nhiều dòng).
- Trang chi tiết sản phẩm (`/san-pham/[slug]`) hiện khối "Chính sách bảo hành (Tên thương hiệu)" nếu thương hiệu đó đã được nhập chính sách — tự ẩn nếu chưa nhập, không hiện thông tin rỗng hoặc giả.
- Trang thương hiệu (`/thuong-hieu/[slug]`) cũng hiện chính sách bảo hành của hãng đó.

### 📌 Cần Zen làm thủ công

Mình **không tự bịa nội dung bảo hành** (số năm, điều kiện...) vì đây là cam kết kinh doanh/pháp lý thật, phải do Zen xác nhận. Sau khi deploy, vào `/admin/brands`, bấm "Sửa" từng thương hiệu và nhập đúng chính sách thật (nếu có) — thương hiệu nào chưa nhập sẽ không hiện khối này trên trang sản phẩm, không phải lỗi.

---

## v0.24.0 — Màu sắc/độ dày/chiều dài nhiều loại, giá công khai chung chung

### 🗄️ Schema thay đổi (cần chạy `prisma db push`)

Đổi kiểu dữ liệu 2 cột trên `Product`:
```prisma
thickness    Decimal? @db.Decimal(8, 2)   →   thickness    String?
stockLength  Int?                          →   stockLength  String?
```
Lý do: cho phép nhập **nhiều giá trị cùng lúc**, phân tách bằng dấu phẩy (VD: `"1.4mm, 2.0mm"`, `"3000mm, 6000mm"`) — trước đây mỗi sản phẩm chỉ lưu được đúng 1 độ dày / 1 chiều dài. `color` giữ nguyên kiểu `String?` như cũ nhưng giờ được diễn giải là danh sách, cùng cách nhập.

> ⚠️ Dữ liệu số cũ (nếu có) sẽ tự chuyển thành chữ khi `db push` (VD: `2.00` → `"2.00"`), không mất dữ liệu, nhưng Zen nên vào `/admin/products` kiểm tra và bổ sung đơn vị (mm) nếu cần cho các sản phẩm đã có sẵn từ trước.

### ✨ Thay đổi hiển thị

- **Màu sắc, độ dày, chiều dài thanh**: trang chi tiết sản phẩm và card sản phẩm giờ hiện **từng giá trị riêng** (dạng tag/chip) nếu nhập nhiều, thay vì gộp chung 1 dòng.
- Form thêm/sửa sản phẩm: đổi 2 ô Độ dày/Chiều dài từ ô số sang ô chữ, có gợi ý "có thể nhập nhiều, phân tách bằng dấu phẩy".
- **Giá bán lẻ hiển thị chung chung hơn**: đổi từ hiện giá cố định (VD: "220.000đ/kg") sang dạng tham khảo **"Từ 220.000đ/kg"**, kèm ghi chú giá có thể thay đổi theo cấu hình thực tế — áp dụng cho trang chi tiết sản phẩm và card sản phẩm.
- **Giá đại lý**: xác nhận lại — **chưa từng và vẫn không** hiển thị ở bất kỳ trang công khai nào (chỉ có trong `/admin`), đúng yêu cầu.

### File đã sửa

`prisma/schema.prisma`, `types/product.ts`, `lib/productDisplay.ts` (mới), `app/san-pham/[slug]/page.tsx`, `app/san-pham/page.tsx`, `app/page.tsx`, `app/thuong-hieu/[slug]/page.tsx`, `app/api/catalog/products/route.ts`, `components/DatabaseProductCard.tsx`, `app/admin/products/page.tsx`, `app/admin/products/[id]/page.tsx`, `components/admin/ProductForm.tsx`, `components/admin/ProductEditForm.tsx`, `app/api/admin/products/route.ts`, `app/api/admin/products/[id]/route.ts`, `data/seed-data.json` (ví dụ minh hoạ nhiều giá trị cho sản phẩm Xingfa hệ 55).

---

## v0.23.1 — So sánh sản phẩm theo từng danh mục

`/so-sanh` giờ có tab chọn danh mục trước — danh sách sản phẩm để chọn so sánh chỉ hiện đúng sản phẩm trong danh mục đang chọn (trước đây trộn tất cả sản phẩm mọi danh mục vào 1 danh sách dài, dễ so sánh nhầm sản phẩm không cùng loại, ví dụ nhôm thanh với tủ bếp). Bỏ dòng "Danh mục" trong bảng so sánh vì giờ luôn cùng 1 danh mục, không cần hiển thị lại.

---

## v0.23.0 — Thêm Sửa/Xóa cho Danh mục và Thương hiệu

### 🔴 Xác nhận đây là thiếu tính năng thật, không phải lỗi

Kiểm tra lại: `/admin/categories` và `/admin/brands` từ trước đến nay **chỉ có form thêm mới**, không hề có nút Sửa hoặc Xóa, và cũng chưa có API route xử lý cập nhật/xóa theo id. Không phải do lỗi phát sinh — tính năng này chưa từng được xây dựng.

(Sản phẩm — `/admin/products` — đã có Sửa/Xóa đầy đủ từ trước, không có vấn đề gì.)

### ✅ Đã thêm

- `app/api/admin/categories/[id]/route.ts`, `app/api/admin/brands/[id]/route.ts` — PUT (cập nhật) + DELETE, có thông báo rõ ràng nếu không xóa được vì đang có sản phẩm sử dụng (ràng buộc khóa ngoại).
- `app/admin/categories/[id]/page.tsx`, `app/admin/brands/[id]/page.tsx` — trang sửa riêng cho từng danh mục/thương hiệu, có thêm ô "Đang hoạt động" để ẩn/hiện trên website mà không cần xóa hẳn.
- Component chung `EntityEditForm`, `EntityDeleteButton` — dùng lại cho cả 2 (Danh mục và Thương hiệu có cùng cấu trúc dữ liệu: tên, slug, mô tả, trạng thái hoạt động).
- Thêm nút "Sửa" / "Xóa" vào từng dòng trong danh sách `/admin/categories` và `/admin/brands`.

---

## v0.22.1 — Sửa lỗi "File is not defined" khi tải ảnh lên Media

### 🔴 Lỗi thật

`app/api/admin/media/route.ts` và `app/api/admin/prices/import/route.ts` dùng `item instanceof File` để kiểm tra file upload — biến toàn cục `File` **không phải lúc nào cũng có sẵn** trong runtime Node.js trên Railway, gây lỗi `ReferenceError: File is not defined` mỗi khi tải ảnh lên Media Manager (và khi nhập giá từ Excel).

### ✅ Đã sửa

Bỏ hẳn `instanceof File`, thay bằng cách lọc theo `typeof item !== "string"` — vì `FormData` chỉ trả về `string` hoặc `File` cho mỗi trường, không cần dùng đến biến `File` toàn cục nữa. Áp dụng cho cả 2 route bị ảnh hưởng.

---

## v0.22.0 — Cập nhật thông tin liên hệ theo thực tế (đối chiếu www.congthanhco.com)

### 🔧 Sửa dữ liệu giả bằng dữ liệu thật

Đối chiếu trực tiếp với trang `www.congthanhco.com` đang chạy thật:

- **`data/site.ts`**: hotline giả `0900 000 000` → **`0908 22 99 77`** (số thật, khớp site chính). Bỏ email giả `info@congthanhco.com` (site thật không công khai email nào — không tạo email giả).
- Thêm mới `site.locations` — **3 địa chỉ + số điện thoại riêng thật**, lấy đúng từ footer trang chính:
  1. Trụ sở chính & kho — 595A Trần Hưng Đạo — 02963 858 333
  2. Xưởng sản xuất & sơn tĩnh điện — 621/46 Trần Hưng Đạo — 02963 989 199
  3. Showroom — 909 Trần Hưng Đạo — 02963 853 587
- Thêm `site.zaloUrl` thật (`zalo.me/0908229977`, lấy từ widget Zalo trên site chính) làm giá trị dự phòng khi chưa cấu hình `NEXT_PUBLIC_ZALO_URL`.
- **`components/Footer.tsx`**: hiện đủ 3 địa chỉ (trước đây chỉ hiện 1), có nút Zalo thật ở dòng cuối. Bỏ dòng "Website v0.9..." hard-code (dễ lỗi thời), thay bằng năm hiện tại tự động + tên pháp nhân đầy đủ.
- **`app/lien-he/page.tsx`**: hiện đủ 3 địa chỉ kèm số điện thoại riêng từng nơi (trước đây chỉ 1 địa chỉ chung).

### ℹ️ Không cần làm lại

Link **Song Bảo Vệ Nhôm** (`songbaove.up.railway.app`) trong trang `/phan-mem` **đã được thêm ở bản v0.18.2 trước đó** — xác nhận vẫn còn, không cần thêm lại.

---

## v0.21.0 — Sprint: Services, Contact Maps/Zalo/Facebook, SEO sâu hơn

Hoàn thành phần còn lại của sprint (6, 7, 8). Mục 9 (Performance) đã rà soát — **không cần sửa**, xem chi tiết bên dưới.

### ✨ Sprint 6 — Trang Dịch vụ mới (`/dich-vu`)

5 dịch vụ đúng yêu cầu (Nhôm thanh, Phụ kiện, Gia công thành phẩm, Sơn tĩnh điện, Nội thất nhôm) — dùng lại đúng dữ liệu `services` đã có trong `data/site-content.json`, không tạo nội dung mới.

### ✨ Sprint 7 — Contact hoàn thiện

- **Google Maps**: nhúng iframe theo địa chỉ công ty, không cần API key.
- **Zalo**: biến `NEXT_PUBLIC_ZALO_URL` đã tồn tại từ trước trong `.env.example` nhưng **chưa từng được dùng ở đâu** — giờ hiển thị nút "Nhắn Zalo" nếu biến này được cấu hình.
- **Facebook**: thêm biến mới `NEXT_PUBLIC_FACEBOOK_URL` (rỗng theo mặc định) — nút chỉ hiện khi Zen cấu hình link thật, không tạo link giả.

### ✨ Sprint 8 — SEO sâu hơn

- Thêm `metadataBase` + Open Graph mặc định (site name, locale `vi_VN`) ở `app/layout.tsx` — giúp ảnh OG và canonical resolve đúng domain thật.
- Thêm `alternates.canonical` cho 8 trang tĩnh: `/san-pham`, `/du-an`, `/lien-he`, `/bang-gia`, `/phan-mem`, `/gioi-thieu`, `/thuong-hieu`, `/dich-vu`.
- Thêm `/dich-vu` vào `sitemap.ts`.

### ✅ Sprint 9 — Performance (đã rà soát, không cần sửa)

Kiểm tra toàn bộ `priority` trên `next/image`: chỉ dùng cho ảnh hero (trang chủ, giới thiệu), logo header, và ảnh chính trong `ProductGallery` (ảnh LCP hợp lý cho từng trang) — **không có ảnh nào bị đặt `priority` dư thừa**. Các ảnh còn lại đã tự lazy-load theo mặc định của `next/image`, không cần sửa gì thêm.

### 📝 Ghi nhận (chưa sửa, cần Zen xác nhận)

`data/site.ts` đang có **hotline giả** (`0900 000 000`) và **email giả** (`info@congthanhco.com`) làm giá trị dự phòng khi thiếu biến môi trường — khác với hotline thật `0908 22 99 77` đã dùng ở các nơi khác trong dự án. Mình **chưa sửa** vì đây là file được nhiều component dùng chung và không nằm trong sprint lần này — Zen xác nhận muốn mình cập nhật lại không?

---

## v0.20.0 — Sprint: Products, Projects, Brands landing page

Vẫn tuân thủ "KHÔNG REFACTOR" — chỉ bổ sung route/UI mới, không đổi schema, API, hay CMS hiện có.

### ✨ Sprint 3 — Hoàn thiện Products

- **Related Products**: trang chi tiết sản phẩm giờ hiện tối đa 4 sản phẩm cùng danh mục.
- **FAQ**: thêm khối câu hỏi thường gặp (dạng accordion `<details>`, không cần JS) — dùng lại đúng nội dung `faq` đã có trong `data/site-content.json`, không tạo nội dung mới.
- Download Catalogue/PDF, Gallery, SEO: **đã có từ trước**, không đổi.

### ✨ Sprint 4 — Hoàn thiện Projects

- **Filter**: thêm lọc theo khu vực (`location`) ở `/du-an` — dropdown các khu vực đang có dự án công khai.
- **Gallery đầy đủ**: trang chi tiết dự án giờ hiện đúng field `gallery` (đã có sẵn trong schema, chưa từng dùng) cùng `coverUrl`, dùng lại component `ProductGallery` (ảnh chính + thumbnail bấm chuyển).

### ✨ Sprint 5 — Brands landing page

- `/thuong-hieu` — danh sách thương hiệu (logo hoặc tên tạm nếu chưa có logo, số sản phẩm mỗi thương hiệu).
- `/thuong-hieu/[slug]` — trang riêng từng thương hiệu: mô tả + toàn bộ sản phẩm công khai của thương hiệu đó.
- Thêm 2 route này vào `sitemap.ts` và menu Header (`Giới thiệu`, `Thương hiệu` — trước đây trang Giới thiệu ở bản trước cũng chưa có trong menu, giờ bổ sung luôn).
- **Không đổi database** — chỉ query thêm từ bảng `Brand`/`Product` đã có.

### Còn lại

6. Services (trang riêng 5 dịch vụ)
7. Contact: Google Maps
8. SEO: OG đầy đủ hơn, canonical
9. Performance: rà soát lazy-load

---

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
