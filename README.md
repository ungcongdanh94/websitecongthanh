# CÔNG THẢNH Website v0.6

## Điểm mới

- Chỉnh sửa sản phẩm đầy đủ.
- Tìm kiếm sản phẩm trong CMS.
- Quản lý danh mục.
- Quản lý thương hiệu.
- Cập nhật trạng thái yêu cầu báo giá.
- Menu quản trị rõ ràng hơn.
- Giữ nguyên giao diện premium v0.5.
- Không làm mất dữ liệu hiện tại.

## Cập nhật

```powershell
npm.cmd install
npm.cmd run build
git add .
git commit -m "Upgrade website to v0.6 CMS management"
git push origin main
```

## Sau khi Railway deploy

```bash
npx prisma db push
npm run db:seed
```

## Trang quản trị

- `/admin/products`
- `/admin/categories`
- `/admin/brands`
- `/admin/quotes`
