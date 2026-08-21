// Cấu trúc menu nhiều cấp cho mục "Sản phẩm" — mô phỏng đúng cách nhóm danh mục
// của website cũ (congthanhlx.mysapo.net): 5 nhóm lớn, 3 nhóm đầu có thêm danh
// sách hệ sản phẩm con (flyout), 2 nhóm cuối là liên kết trực tiếp.
export type ProductMenuLeaf = { name: string; slug: string };
export type ProductMenuGroup = { name: string; slug?: string; children?: ProductMenuLeaf[] };

export const productMenu: ProductMenuGroup[] = [
  {
    name: "Cửa Kéo - Cửa Cuốn",
    children: [
      { name: "Cửa Cuốn ONEDOOR", slug: "onedoor" },
      { name: "Cửa Kéo/Cuốn CTDOOR", slug: "ctdoor" },
      { name: "Phụ Kiện Cửa Cuốn", slug: "phu-kien-cua-cuon" }
    ]
  },
  {
    name: "Cửa Nhôm",
    children: [
      { name: "Xingfa Quảng Đông / Nội Địa", slug: "xingfa-quang-dong-noi-dia" },
      { name: "Xingfa Class A - Cao Cấp", slug: "xingfa-class-a" },
      { name: "Nhôm Nhật MAXPRO JP", slug: "maxpro-jp" },
      { name: "Hệ Trượt Quay", slug: "he-truot-quay" },
      { name: "Hệ Slim", slug: "he-slim" },
      { name: "Hệ Thủy Lực", slug: "he-thuy-luc" }
    ]
  },
  {
    name: "Cửa Kính",
    children: [
      { name: "Cửa Kính Mở Thủy Lực", slug: "cua-kinh-thuy-luc" },
      { name: "Cửa Kính Lùa Treo", slug: "cua-kinh-lua-treo" },
      { name: "Vách Ngăn Kính", slug: "vach-ngan-kinh" },
      { name: "Phòng Tắm Kính (Cabin)", slug: "phong-tam-kinh" }
    ]
  },
  { name: "Cửa Sắt - Inox", slug: "cua-sat-inox" },
  { name: "Tủ Nhôm Nội Thất Cánh Kính", slug: "tu-noi-that-nhom" }
];
