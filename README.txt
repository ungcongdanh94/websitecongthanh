BẢN VÁ PRODUCT ROUTE v0.11.3

Cấu trúc đúng:
- app/api/admin/products/route.ts: chỉ có POST
- app/api/admin/products/[id]/route.ts: có PUT và DELETE

Cách áp dụng:
1. Giải nén file ZIP.
2. Chép thư mục app vào root dự án, chọn ghi đè.
3. Chạy:
   npm.cmd run build
4. Nếu thành công:
   git add .
   git commit -m "Fix product route handlers v0.11.3"
   git pull --rebase origin main
   git push origin main
