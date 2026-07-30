# Deploy v0.2 lên Railway

## 1. Tạo PostgreSQL

Trong Railway Project:

1. Chọn **New**
2. Chọn **Database**
3. Chọn **PostgreSQL**

Railway sẽ tạo biến `DATABASE_URL`.

## 2. Kết nối website

Trong service website, thêm biến:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXT_PUBLIC_SITE_URL=https://congthanhco.com
NEXT_PUBLIC_HOTLINE=...
NEXT_PUBLIC_ZALO_URL=...
```

Tên `Postgres` có thể khác tùy tên service database của bạn.

## 3. Deploy schema

Sau khi build thành công, mở Railway Shell và chạy:

```bash
npx prisma db push
npm run db:seed
```

## 4. Kiểm tra

- `/` giao diện chính
- `/lien-he` gửi yêu cầu báo giá
- `/admin` khung CMS
- `POST /api/quote-requests` API lưu báo giá

## 5. Cập nhật từ máy lên GitHub

```bash
git add .
git commit -m "Upgrade CÔNG THẢNH website to v0.2"
git push origin main
```
