# Railway Deploy — v0.5

Không cần tạo database mới.

## Variables

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
ADMIN_EMAIL=admin@congthanhco.com
ADMIN_PASSWORD=mat-khau-rat-manh
AUTH_SECRET=chuoi-bi-mat-toi-thieu-32-ky-tu
NEXT_PUBLIC_HOTLINE=so-hotline-cua-ban
NEXT_PUBLIC_SITE_URL=https://congthanhco.com
```

## Sau khi deploy

```bash
npx prisma db push
npm run db:seed
```

## Kiểm tra

```text
/
 /san-pham
 /bang-gia
 /lien-he
 /admin
```

Nếu trang chủ không hiện sản phẩm, kiểm tra sản phẩm trong CMS đang ở trạng thái `PUBLISHED`.
