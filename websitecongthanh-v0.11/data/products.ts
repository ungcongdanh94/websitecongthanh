export type Product = {
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  unit: string;
  short: string;
  description: string;
  image: string;
  specs: Record<string, string>;
  featured?: boolean;
};

export const products: Product[] = [
  {
    slug: "nhom-xingfa-class-a-he-55",
    name: "Nhôm Xingfa Class A hệ 55",
    category: "Nhôm thanh",
    brand: "Xingfa Class A",
    price: 158000,
    unit: "kg",
    short: "Hệ nhôm cao cấp cho cửa đi và cửa sổ, bề mặt sang trọng.",
    description: "Sản phẩm phù hợp công trình nhà phố, biệt thự và dự án yêu cầu độ bền cao. Giá hiển thị là giá tham khảo và có thể thay đổi theo màu, độ dày và số lượng.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    specs: { "Hệ nhôm": "55", "Độ dày": "1.4–2.0 mm", "Chiều dài": "6 m", "Ứng dụng": "Cửa đi, cửa sổ" },
    featured: true
  },
  {
    slug: "phu-kien-cmech-cao-cap",
    name: "Bộ phụ kiện CMECH cao cấp",
    category: "Phụ kiện",
    brand: "CMECH",
    price: 2450000,
    unit: "bộ",
    short: "Phụ kiện đồng bộ, vận hành êm và thiết kế hiện đại.",
    description: "Bộ phụ kiện được lựa chọn theo cấu hình cửa. Liên hệ để nhận báo giá chính xác theo kích thước và kiểu mở.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    specs: { "Dòng": "Cao cấp", "Bảo hành": "Theo chính sách hãng", "Màu": "Đen/Xám/Bạc", "Ứng dụng": "Cửa đi, cửa lùa" },
    featured: true
  },
  {
    slug: "tu-bep-nhom-ocean-luxury",
    name: "Tủ bếp nhôm Ocean Luxury",
    category: "Tủ bếp nhôm",
    brand: "Ocean Luxury",
    price: 6800000,
    unit: "mét dài",
    short: "Giải pháp tủ bếp nhôm cao cấp, chống nước và dễ vệ sinh.",
    description: "Thiết kế theo kích thước thực tế, đa dạng màu sắc và phụ kiện. Giá tham khảo chưa bao gồm một số phụ kiện nâng cấp.",
    image: "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1200&q=80",
    specs: { "Vật liệu": "Nhôm nội thất", "Kiểu": "Đo ni đóng giày", "Bảo hành": "Theo cấu hình", "Ứng dụng": "Tủ bếp" },
    featured: true
  },
  {
    slug: "nhom-noi-that-phu-hoan-anh",
    name: "Nhôm nội thất Phú Hoàn Anh",
    category: "Nhôm nội thất",
    brand: "Phú Hoàn Anh",
    price: 175000,
    unit: "kg",
    short: "Hệ profile nội thất dùng cho tủ bếp, tủ áo và kệ trang trí.",
    description: "Sản phẩm phù hợp xưởng sản xuất nội thất nhôm. Có nhiều quy cách và màu sắc để lựa chọn.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
    specs: { "Chiều dài": "6 m", "Ứng dụng": "Tủ bếp, tủ áo", "Màu": "Nhiều lựa chọn", "Đóng gói": "Theo cây/bó" }
  },
  {
    slug: "phu-kien-draho",
    name: "Phụ kiện cửa nhôm DRAHO",
    category: "Phụ kiện",
    brand: "DRAHO",
    price: 1250000,
    unit: "bộ",
    short: "Bộ phụ kiện phổ biến cho cửa nhôm dân dụng và công trình.",
    description: "Có nhiều cấu hình tay nắm, khóa, bản lề và bánh xe. Giá tùy theo bộ sản phẩm.",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80",
    specs: { "Nhóm": "Phụ kiện cửa", "Màu": "Đen/Trắng/Xám", "Lắp đặt": "Theo hệ cửa", "Bảo hành": "Theo hãng" }
  },
  {
    slug: "cua-lua-nhom-cao-cap",
    name: "Giải pháp cửa lùa nhôm cao cấp",
    category: "Giải pháp cửa",
    brand: "CÔNG THẢNH",
    price: 3200000,
    unit: "m²",
    short: "Cửa lùa hiện đại, tối ưu không gian và tầm nhìn.",
    description: "Thiết kế theo kích thước thực tế, lựa chọn hệ nhôm và phụ kiện phù hợp ngân sách.",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    specs: { "Kiểu mở": "Cửa lùa", "Kính": "Theo yêu cầu", "Màu": "Đa dạng", "Thi công": "Theo dự án" }
  }
];

export const categories = Array.from(new Set(products.map((p) => p.category)));
