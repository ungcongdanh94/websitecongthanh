# Railway Deploy — v0.3

## Variables

Trong service website, thêm:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXT_PUBLIC_SITE_URL=https://congthanhco.com
NEXT_PUBLIC_HOTLINE=...
NEXT_PUBLIC_ZALO_URL=...
ADMIN_EMAIL=admin@congthanhco.com
ADMIN_PASSWORD=mat-khau-rat-manh
AUTH_SECRET=chuoi-bi-mat-toi-thieu-32-ky-tu
```

Có thể tạo `AUTH_SECRET` trên máy bằng PowerShell:

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Database

Mở Railway Shell:

```bash
npx prisma db push
npm run db:seed
```

## Đăng nhập

Truy cập:

```text
https://ten-mien-cua-ban/admin/login
```

Dùng `ADMIN_EMAIL` và `ADMIN_PASSWORD` đã khai báo trong Railway.
