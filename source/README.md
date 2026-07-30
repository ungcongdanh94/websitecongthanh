# CÔNG THẢNH Website v0.8

## Điểm mới

- Media Manager tại `/admin/media`.
- Kéo thả và tải nhiều ảnh cùng lúc.
- Lưu ảnh trên Cloudinary, metadata trong PostgreSQL.
- Sao chép URL và xóa ảnh.
- Chọn ảnh trực tiếp trong form sản phẩm, dự án và banner.
- Giới hạn 12 ảnh/lần, 10 MB/ảnh; hỗ trợ JPG, PNG, WebP và GIF.

## Biến môi trường Railway

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Các giá trị nằm trong Cloudinary Dashboard → API Keys.

## Cập nhật database

```bash
npx prisma db push
```

## Triển khai

Chép đè gói v0.8 vào repository, sau đó:

```powershell
npm.cmd install
npm.cmd run build
git add .
git commit -m "Add Media Manager v0.8"
git pull --rebase origin main
git push origin main
```
