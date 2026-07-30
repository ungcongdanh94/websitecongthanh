CÔNG THẢNH WEBSITE v0.8.1 - BẢN SỬA BUILD

1. Giải nén toàn bộ thư mục này.
2. Nhấp phải OVERWRITE-AND-PUSH.ps1 > Run with PowerShell.
3. Script tự clone GitHub nếu websitecongthanh-new đã bị xóa.
4. Script tự chép đè toàn bộ mã nguồn, commit và push main.
5. Railway sẽ tự deploy commit: Fix product publish status and deploy v0.8.1

Đã sửa lỗi TypeScript PublishStatus ARCHIVED trong ProductEditForm và API sản phẩm.
Lệnh Railway start: node .next/standalone/server.js
