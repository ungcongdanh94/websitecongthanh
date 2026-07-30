import { PrismaClient, PublishStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    ["nhom-thanh", "Nhôm thanh", "Các hệ nhôm dùng cho cửa và công trình."],
    ["phu-kien", "Phụ kiện", "Phụ kiện cửa nhôm và giải pháp đồng bộ."],
    ["noi-that-nhom", "Nội thất nhôm", "Giải pháp tủ bếp và tủ nội thất nhôm."]
  ] as const;

  const categoryMap = new Map<string, string>();

  for (const [slug, name, description] of categories) {
    const category = await prisma.category.upsert({
      where: { slug },
      update: { name, description, isActive: true },
      create: { slug, name, description }
    });
    categoryMap.set(slug, category.id);
  }

  const brands = [
    ["xingfa-class-a", "Xingfa Class A"],
    ["cmech", "CMECH"],
    ["candy", "CANDY"],
    ["draho", "DRAHO"],
    ["phu-hoan-anh", "Phú Hoàn Anh"],
    ["ocean-luxury", "Ocean Luxury"]
  ] as const;

  const brandMap = new Map<string, string>();

  for (const [slug, name] of brands) {
    const brand = await prisma.brand.upsert({
      where: { slug },
      update: { name, isActive: true },
      create: { slug, name }
    });
    brandMap.set(slug, brand.id);
  }

  const products = [
    {
      slug: "nhom-xingfa-class-a-he-55",
      name: "Nhôm Xingfa Class A hệ 55",
      category: "nhom-thanh",
      brand: "xingfa-class-a",
      shortDesc: "Hệ nhôm cao cấp dùng cho cửa đi và cửa sổ.",
      unit: "kg",
      specs: { "Hệ nhôm": "55", "Chiều dài thanh": "6 m" }
    },
    {
      slug: "phu-kien-cmech-cua-di",
      name: "Phụ kiện CMECH cho cửa đi",
      category: "phu-kien",
      brand: "cmech",
      shortDesc: "Giải pháp phụ kiện đồng bộ cho cửa nhôm cao cấp.",
      unit: "bộ",
      specs: { "Ứng dụng": "Cửa đi", "Báo giá": "Theo cấu hình" }
    },
    {
      slug: "phu-kien-candy-cua-nhom",
      name: "Phụ kiện CANDY cửa nhôm",
      category: "phu-kien",
      brand: "candy",
      shortDesc: "Phụ kiện cửa nhôm theo từng hệ và kiểu mở.",
      unit: "bộ",
      specs: { "Ứng dụng": "Cửa nhôm", "Báo giá": "Theo cấu hình" }
    },
    {
      slug: "phu-kien-draho-cua-nhom",
      name: "Phụ kiện DRAHO cửa nhôm",
      category: "phu-kien",
      brand: "draho",
      shortDesc: "Bộ phụ kiện phù hợp nhiều dòng cửa nhôm.",
      unit: "bộ",
      specs: { "Ứng dụng": "Cửa nhôm", "Báo giá": "Theo cấu hình" }
    },
    {
      slug: "tu-bep-nhom-phu-hoan-anh",
      name: "Tủ bếp nhôm Phú Hoàn Anh",
      category: "noi-that-nhom",
      brand: "phu-hoan-anh",
      shortDesc: "Giải pháp tủ bếp nhôm cao cấp, thiết kế theo kích thước thực tế.",
      unit: "mét dài",
      specs: { "Vật liệu": "Nhôm nội thất", "Thiết kế": "Theo yêu cầu" }
    },
    {
      slug: "tu-bep-nhom-ocean-luxury",
      name: "Tủ bếp nhôm Ocean Luxury",
      category: "noi-that-nhom",
      brand: "ocean-luxury",
      shortDesc: "Tủ bếp nhôm phong cách hiện đại, thiết kế theo công trình.",
      unit: "mét dài",
      specs: { "Vật liệu": "Nhôm nội thất", "Thiết kế": "Theo yêu cầu" }
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        shortDesc: product.shortDesc,
        unit: product.unit,
        specs: product.specs,
        status: PublishStatus.PUBLISHED,
        isFeatured: ["nhom-xingfa-class-a-he-55", "phu-kien-cmech-cua-di", "tu-bep-nhom-phu-hoan-anh"].includes(product.slug),
        categoryId: categoryMap.get(product.category)!,
        brandId: brandMap.get(product.brand)!
      },
      create: {
        name: product.name,
        slug: product.slug,
        shortDesc: product.shortDesc,
        description:
          "Dữ liệu khởi tạo. Bạn có thể thay đổi nội dung và hình ảnh trong trang quản trị.",
        unit: product.unit,
        specs: product.specs,
        status: PublishStatus.PUBLISHED,
        isFeatured: ["nhom-xingfa-class-a-he-55", "phu-kien-cmech-cua-di", "tu-bep-nhom-phu-hoan-anh"].includes(product.slug),
        categoryId: categoryMap.get(product.category)!,
        brandId: brandMap.get(product.brand)!
      }
    });
  }

  console.log("Seed hoàn tất: danh mục, thương hiệu và sản phẩm khởi tạo đã được đồng bộ.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
