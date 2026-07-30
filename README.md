# CÔNG THẢNH Website v0.4

Website sản phẩm, báo giá và CMS nội bộ cho CÔNG THẢNH.

## Điểm mới v0.4

- Sửa lỗi font tiếng Việt bằng **Be Vietnam Pro**.
- Đồng bộ trang `/san-pham` trực tiếp với PostgreSQL.
- Trang chi tiết sản phẩm đọc dữ liệu từ database.
- Sản phẩm ở trạng thái `PUBLISHED` tự động xuất hiện ngoài website.
- Có nút xóa sản phẩm trong CMS.
- Seed thêm danh mục, thương hiệu và 6 sản phẩm khởi tạo.
- Chuẩn hóa hiển thị giá “Liên hệ” khi chưa nhập giá.

## Cập nhật

```bash
npm install
npm run build
git add .
git commit -m "Upgrade website to v0.4 database products and Vietnamese font"
git push origin main
```

## Sau khi Railway deploy

Mở Railway Shell:

```bash
npx prisma db push
npm run db:seed
```

Sau đó kiểm tra:

- `/san-pham`
- `/admin/products`
- `/admin/products/new`
