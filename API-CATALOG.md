# Catalog API — Tài liệu tích hợp (SketchUp plugin & bên thứ ba)

## Endpoint

```
GET /api/catalog/products
```

Base URL: `https://<domain-cua-ban>/api/catalog/products`

## Xác thực

Mọi request bắt buộc phải gửi kèm header:

```
x-api-key: <api-key-cua-ban>
```

Lấy API key tại trang quản trị: `/admin/api-keys` → "Tạo API key". Key hiển thị đầy đủ **chỉ một lần** ngay sau khi tạo — lưu lại cẩn thận.

Nếu thiếu key hoặc key không hợp lệ/đã bị thu hồi → phản hồi `401`:

```json
{ "ok": false, "message": "Thiếu API key. Gửi kèm header 'x-api-key'." }
```

## Giới hạn tần suất (Rate limit)

**60 request / phút** cho mỗi API key. Vượt quá → phản hồi `429`:

```json
{ "ok": false, "message": "Vượt quá giới hạn tần suất gọi API (60 lượt / phút). Thử lại sau." }
```

Header `X-RateLimit-Remaining` trong mỗi response thành công cho biết số lượt còn lại trong cửa sổ 60 giây hiện tại.

> Lưu ý: rate limit hiện lưu trong bộ nhớ của 1 instance Railway — đủ dùng cho quy mô hiện tại. Nếu sau này scale nhiều instance, cần chuyển sang giải pháp rate-limit tập trung (ví dụ Redis).

## Tham số truy vấn (query params)

| Tham số | Bắt buộc | Mô tả |
|---|---|---|
| `brand` | Không | Lọc theo slug thương hiệu (ví dụ `xingfa-class-a`) |
| `category` | Không | Lọc theo slug danh mục (ví dụ `nhom-thanh`) |
| `system` | Không | Lọc theo hệ nhôm (ví dụ `Hệ 55`), không phân biệt hoa/thường |
| `page` | Không | Trang, mặc định `1` |
| `pageSize` | Không | Số sản phẩm/trang, mặc định `50`, tối đa `100` |

## Ví dụ request

```bash
curl "https://congthanhco.com/api/catalog/products?category=nhom-thanh&page=1&pageSize=20" \
  -H "x-api-key: ct_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Response

```json
{
  "ok": true,
  "page": 1,
  "pageSize": 20,
  "total": 6,
  "totalPages": 1,
  "hasMore": false,
  "products": [
    {
      "id": "clxxxxx",
      "sku": null,
      "name": "Nhôm Xingfa Class A hệ 55",
      "slug": "nhom-xingfa-class-a-he-55",
      "category": { "name": "Nhôm thanh", "slug": "nhom-thanh" },
      "brand": { "name": "Xingfa Class A", "slug": "xingfa-class-a" },
      "productLine": "Class A",
      "aluminumSystem": "Hệ 55",
      "color": "Ghi xám",
      "thickness": 2.0,
      "stockLength": 6000,
      "unit": "kg",
      "price": null,
      "imageUrl": "/assets/products/product-xingfa-class-a.webp",
      "gallery": [],
      "catalogUrl": null,
      "updatedAt": "2026-08-03T10:00:00.000Z"
    }
  ]
}
```

**Lưu ý bảo mật**: endpoint này **không** trả về `dealerPrice` (giá đại lý nội bộ) — chỉ trả `price` (giá bán công khai) và thông số kỹ thuật. Đây là quyết định có chủ đích, không phải thiếu sót.

## Quản lý API key

- Tạo key mới: `/admin/api-keys`
- Thu hồi key: bấm "Thu hồi" (key vẫn còn trong hệ thống, chỉ tạm ngừng hoạt động, có thể kích hoạt lại)
- Xóa vĩnh viễn: bấm "Xóa" (không thể khôi phục)

## Lộ trình tiếp theo (chưa làm)

- Xác thực OAuth/JWT đầy đủ nếu cần phân quyền chi tiết hơn theo plugin
- Endpoint riêng cho tải file CAD/SketchUp (`catalogUrl` hiện đã có trong response nhưng chưa có endpoint tải trực tiếp có kiểm soát)
- Webhook thông báo khi sản phẩm/giá thay đổi (thay vì phải polling)
