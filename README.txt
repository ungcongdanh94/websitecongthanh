BẢN VÁ MEDIA ROUTE v0.11.2

Chép thư mục app vào root repository và chọn ghi đè.

Kiểm tra:
1. app/api/admin/media/route.ts chỉ có GET và POST.
2. app/api/admin/media/[id]/route.ts chỉ có DELETE.

Sau đó chạy:
  npm.cmd run build
  git add .
  git commit -m "Fix media delete route v0.11.2"
  git pull --rebase origin main
  git push origin main
