# CÔNG THẢNH Website v0.9.0

Nền tảng website + CMS dành cho ngành nhôm, phụ kiện và nội thất nhôm.

## Điểm mới v0.9

- Mở rộng dữ liệu sản phẩm theo đúng ngành:
  - Dòng sản phẩm
  - Hệ nhôm
  - Màu sắc
  - Độ dày
  - Chiều dài thanh
  - Giá bán lẻ
  - Giá đại lý
  - Catalogue PDF
  - Video giới thiệu
- Bộ lọc sản phẩm ngoài website theo danh mục, thương hiệu và hệ nhôm.
- Trang chi tiết hiển thị quy cách kỹ thuật rõ ràng.
- CMS tìm kiếm theo hệ nhôm và dòng sản phẩm.
- Giữ nguyên Media Manager, Dự án, Banner và Báo giá.

## Triển khai

Sau khi cập nhật code:

```bash
npm install
npm run build
git add .
git commit -m "Add aluminum product module v0.9"
git push origin main
```

Sau khi Railway deploy, chạy:

```bash
npx prisma db push
npm run db:seed
```

## Lưu ý

`dealerPrice` chỉ được quản lý trong CMS, chưa hiển thị công khai ngoài website.
