# CÔNG THẢNH Website v0.3

Website sản phẩm, báo giá và CMS nội bộ cho CÔNG THẢNH.

## Công nghệ

- Next.js 15.5.22
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- JWT cookie bằng `jose`
- Railway

## v0.3 có gì mới

- Đăng nhập quản trị tại `/admin/login`
- Middleware bảo vệ toàn bộ `/admin`
- Dashboard thống kê
- Danh sách sản phẩm
- Thêm sản phẩm mới
- Danh sách yêu cầu báo giá
- Đăng xuất quản trị
- Nâng Next.js lên 15.5.22

## Biến môi trường bắt buộc

```env
DATABASE_URL=...
ADMIN_EMAIL=admin@congthanhco.com
ADMIN_PASSWORD=...
AUTH_SECRET=...
```

`AUTH_SECRET` phải dài ít nhất 32 ký tự.

## Chạy local

```bash
npm install
copy .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

## Deploy Railway

Sau khi push GitHub và deploy:

```bash
npx prisma db push
npm run db:seed
```

Sau đó truy cập:

- `/admin/login`
- `/admin/products`
- `/admin/products/new`
- `/admin/quotes`
