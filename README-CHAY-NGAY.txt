CÔNG THẢNH WEBSITE - BỘ MÃ NGUỒN TỔNG v0.8

1. Giải nén file ZIP ra một thư mục riêng.
2. Nhấp chuột phải OVERWRITE-AND-PUSH.ps1 -> Run with PowerShell.
3. Script sẽ:
   - giữ lại thư mục .git và các file .env cục bộ;
   - xóa mã nguồn cũ;
   - chép toàn bộ mã nguồn v0.8;
   - commit và push lên nhánh main.

Repository mặc định:
C:\Users\ACER\Downloads\websitecongthanh-new

Railway phải dùng nhánh main. railway.json đã đặt trực tiếp:
node .next/standalone/server.js

Sau khi Railway deploy thành công, cập nhật database:
npx prisma db push
