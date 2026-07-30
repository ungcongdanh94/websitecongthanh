# CÔNG THẢNH Website v0.5

Bản giao diện thương mại đầu tiên của website CÔNG THẢNH.

## Điểm mới

- Thiết kế lại trang chủ theo phong cách cao cấp, hiện đại.
- Header responsive, có trạng thái menu đang chọn.
- Footer hoàn chỉnh với thông tin doanh nghiệp.
- Tách header/footer website khỏi khu vực `/admin`.
- Trang chủ lấy sản phẩm trực tiếp từ PostgreSQL.
- Bảng giá lấy dữ liệu trực tiếp từ PostgreSQL.
- Trang liên hệ và form báo giá được thiết kế lại.
- Tiếp tục sử dụng Be Vietnam Pro cho tiếng Việt.
- Giữ nguyên CMS và dữ liệu hiện có.

## Cập nhật local

```powershell
npm.cmd install
npm.cmd run build
git add .
git commit -m "Upgrade CÔNG THẢNH website to v0.5 premium UI"
git push origin main
```

## Sau khi Railway deploy

```bash
npx prisma db push
npm run db:seed
```

## Trang cần kiểm tra

- `/`
- `/san-pham`
- `/bang-gia`
- `/lien-he`
- `/admin`
- `/admin/products`
