# CÔNG THẢNH Website v0.1

Website giới thiệu sản phẩm và bảng giá cho CÔNG THẢNH, xây dựng bằng Next.js, TypeScript và Tailwind CSS.

## Chức năng hiện có

- Trang chủ cao cấp tông xanh lá
- Danh mục sản phẩm
- Tìm kiếm và lọc sản phẩm
- Trang chi tiết sản phẩm
- Bảng giá tham khảo
- So sánh sản phẩm
- Dự án
- Trang phần mềm thiết kế
- Trang liên hệ
- Responsive cho điện thoại và máy tính
- Sẵn cấu hình Railway

## Chạy trên máy

```bash
npm install
npm run dev
```

Mở: http://localhost:3000

## Upload GitHub

```bash
git init
git add .
git commit -m "Initial CÔNG THẢNH website"
git branch -M main
git remote add origin <URL_REPOSITORY_GITHUB>
git push -u origin main
```

## Deploy Railway

1. Tạo New Project trên Railway.
2. Chọn Deploy from GitHub Repo.
3. Chọn repository vừa upload.
4. Railway tự nhận `railway.json`.
5. Thêm domain hoặc nối `congthanhco.com`.

## Thay dữ liệu

- Sản phẩm: `data/products.ts`
- Thông tin công ty: `data/site.ts`
- Ảnh mẫu: đang dùng Unsplash, nên thay bằng ảnh sản phẩm thật.
- Hotline/Zalo: chỉnh trong `.env` hoặc `data/site.ts`.

## Giai đoạn kế tiếp

- Trang quản trị sản phẩm và bảng giá
- Upload ảnh
- Yêu cầu báo giá
- Xuất báo giá PDF
- Tin tức chuẩn SEO
