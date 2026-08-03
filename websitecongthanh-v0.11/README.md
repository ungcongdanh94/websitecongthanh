# CÔNG THẢNH Website v0.11.0

## Tính năng mới: Báo giá chuyên nghiệp

- Tạo báo giá trực tiếp từ CMS.
- Chọn sản phẩm và tự lấy giá bán.
- Nhập sản phẩm tùy chỉnh.
- Chiết khấu từng dòng và chiết khấu toàn đơn.
- Tính VAT và tổng tiền tự động.
- Lưu thời hạn hiệu lực, ghi chú và điều khoản.
- Theo dõi trạng thái báo giá.
- Trang in A4 và lưu PDF bằng trình duyệt.

## Cập nhật

```powershell
npm.cmd install
npm.cmd run build
git add .
git commit -m "Add professional quotation module v0.11"
git pull --rebase origin main
git push origin main
```

Sau khi Railway deploy:

```bash
npx prisma db push
```

Truy cập:

- `/admin/quotes`
- `/admin/quotes/[id]`
- `/admin/quotes/[id]/print`
