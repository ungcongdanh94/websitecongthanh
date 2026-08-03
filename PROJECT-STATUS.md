# CÔNG THẢNH Website — Trạng thái v0.10.0

## Đã hoàn thành

- Website giao diện cao cấp.
- CMS sản phẩm, danh mục, thương hiệu, dự án, banner và media.
- Cloudinary Media Manager.
- PostgreSQL + Prisma.
- Module sản phẩm chuyên ngành nhôm.
- Quản lý bảng giá hàng loạt.
- Lịch sử thay đổi giá bán và giá đại lý.
- Xuất bảng giá CSV có dấu tiếng Việt.
- Public Catalog API tại `/api/catalog/products` để chuẩn bị cho plugin SketchUp.

## Việc cần làm sau khi deploy

```bash
npx prisma db push
```

## Sprint tiếp theo

- Import bảng giá CSV.
- Báo giá có nhiều sản phẩm.
- Xuất báo giá PDF.
- API có khóa bảo mật cho plugin SketchUp.
