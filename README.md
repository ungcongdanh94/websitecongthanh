# CÔNG THẢNH Website v0.10.0

## Điểm mới

- Trang quản trị bảng giá tại `/admin/prices`.
- Cập nhật nhiều sản phẩm trong một lần.
- Lưu lịch sử giá.
- Xuất CSV.
- API sản phẩm công khai tại `/api/catalog/products`.

## Cập nhật Railway

Sau khi deploy:

```bash
npx prisma db push
```

## Build local

```powershell
npm.cmd install
npm.cmd run build
```
