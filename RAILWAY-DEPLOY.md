# Railway Deploy — v0.9.0

## Root Directory

Để trống nếu `package.json` nằm ở gốc repository.

## Build / Start

```text
Build Command: npm run build
Start Command: node .next/standalone/server.js
```

## Variables bắt buộc

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
AUTH_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_SITE_URL=...
NEXT_PUBLIC_HOTLINE=...
```

## Sau khi deploy

Mở Railway Shell:

```bash
npx prisma db push
npm run db:seed
```

## Kiểm tra

```text
/
 /san-pham
 /admin/products
 /admin/media
 /admin/projects
 /admin/banners
```
