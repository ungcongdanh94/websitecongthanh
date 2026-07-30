# Railway Deploy — v0.4

## 1. Variables bắt buộc

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
ADMIN_EMAIL=admin@congthanhco.com
ADMIN_PASSWORD=mat-khau-rat-manh
AUTH_SECRET=chuoi-bi-mat-toi-thieu-32-ky-tu
```

## 2. Sau khi deploy thành công

Mở Railway Shell:

```bash
npx prisma db push
npm run db:seed
```

## 3. Kiểm tra dữ liệu

```bash
node -e "const {PrismaClient}=require('@prisma/client'); const p=new PrismaClient(); Promise.all([p.product.count(),p.category.count(),p.brand.count()]).then(console.log).finally(()=>p.$disconnect())"
```

Kết quả dự kiến tối thiểu:

```text
[ 6, 3, 6 ]
```

## 4. Kiểm tra font

Mở các trang:

- `/`
- `/san-pham`
- `/admin/products`

Chữ “CÔNG THẢNH”, “Sản phẩm”, “Yêu cầu báo giá” phải hiển thị rõ dấu tiếng Việt.
