# CÔNG THẢNH Website v0.2

Nền tảng website sản phẩm và báo giá cho CÔNG THẢNH.

## Công nghệ

- Next.js 15
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Railway

## v0.2 có gì mới

- Database schema cho sản phẩm, thương hiệu, danh mục, dự án, tin tức, báo giá và cài đặt.
- API `POST /api/quote-requests`.
- Form báo giá lưu vào PostgreSQL.
- Khung giao diện CMS tại `/admin`.
- Prisma seed.
- Hướng dẫn Railway.

## Chạy local

```bash
npm install
copy .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

## Lưu ý

Bạn cần PostgreSQL và phải sửa `DATABASE_URL` trong `.env`.

Xem hướng dẫn triển khai trong `RAILWAY-DEPLOY.md`.
