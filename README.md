# CÔNG THẢNH Website v0.7

## Điểm mới

- CMS quản lý dự án.
- Trang công khai `/du-an`.
- Trang chi tiết dự án.
- CMS thêm banner.
- Menu quản trị bổ sung Dự án và Banner.
- Không thay đổi cấu trúc database hiện có.

## Cập nhật

```powershell
npm.cmd install
npm.cmd run build
git add .
git commit -m "Add project and banner CMS"
git push origin main
```

Sau khi Railway deploy:

```bash
npx prisma db push
```
