import { PrismaClient, PublishStatus } from "@prisma/client";
import siteAssets from "../data/site-assets.json";
import brandContent from "../data/brand-content.json";

const prisma = new PrismaClient();

function findAsset(keyword: string): string {
  const match = siteAssets.assets.products.find((path) => path.includes(keyword));
  if (!match) throw new Error(`Không tìm thấy ảnh sản phẩm khớp từ khoá: ${keyword}`);
  return match;
}

function findProjectAsset(keyword: string): string {
  const match = siteAssets.assets.projects.find((path) => path.includes(keyword));
  if (!match) throw new Error(`Không tìm thấy ảnh dự án khớp từ khoá: ${keyword}`);
  return match;
}

// Ảnh cho từng slug sản phẩm. Xingfa/Phú Hoàn Anh/Ocean Luxury có ảnh riêng;
// Candy và Draho (phụ kiện) chưa có ảnh chụp riêng nên dùng chung ảnh phụ kiện CMECH
// làm ảnh mặc định — cập nhật lại khi có ảnh thật qua CMS.
const productImages: Record<string, { imageUrl: string; gallery?: string[] }> = {
  "nhom-xingfa-class-a-he-55": { imageUrl: findAsset("xingfa-class-a") },
  "phu-kien-cmech-cua-di": {
    imageUrl: findAsset("cmech-hinge"),
    gallery: [findAsset("cmech-handle")]
  },
  "phu-kien-candy-cua-nhom": { imageUrl: findAsset("cmech-handle") },
  "phu-kien-draho-cua-nhom": { imageUrl: findAsset("cmech-hinge") },
  "tu-bep-nhom-phu-hoan-anh": { imageUrl: findAsset("phu-hoan-anh") },
  "tu-bep-nhom-ocean-luxury": { imageUrl: findAsset("ocean-luxury") }
};

async function main() {
  // ---------- Danh mục ----------
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

  // ---------- Thương hiệu ----------
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

  // ---------- Sản phẩm ----------
  const products = [
    {
      slug: "nhom-xingfa-class-a-he-55",
      name: "Nhôm Xingfa Class A hệ 55",
      category: "nhom-thanh",
      brand: "xingfa-class-a",
      shortDesc: "Hệ nhôm cao cấp dùng cho cửa đi và cửa sổ.",
      unit: "kg",
      productLine: "Class A",
      aluminumSystem: "Hệ 55",
      color: "Ghi xám",
      thickness: 2.0,
      stockLength: 6000,
      specs: { "Ứng dụng": "Cửa đi, cửa sổ" }
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

  const featuredSlugs = ["nhom-xingfa-class-a-he-55", "phu-kien-cmech-cua-di", "tu-bep-nhom-phu-hoan-anh"];

  for (const product of products) {
    const image = productImages[product.slug];

    const sharedData = {
      name: product.name,
      shortDesc: product.shortDesc,
      imageUrl: image.imageUrl,
      gallery: image.gallery ?? undefined,
      unit: product.unit,
      productLine: "productLine" in product ? product.productLine : null,
      aluminumSystem: "aluminumSystem" in product ? product.aluminumSystem : null,
      color: "color" in product ? product.color : null,
      thickness: "thickness" in product ? product.thickness : null,
      stockLength: "stockLength" in product ? product.stockLength : null,
      specs: product.specs,
      status: PublishStatus.PUBLISHED,
      isFeatured: featuredSlugs.includes(product.slug),
      categoryId: categoryMap.get(product.category)!,
      brandId: brandMap.get(product.brand)!
    };

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: sharedData,
      create: {
        ...sharedData,
        slug: product.slug,
        description: "Dữ liệu khởi tạo. Bạn có thể thay đổi nội dung và hình ảnh trong trang quản trị."
      }
    });
  }

  // ---------- Dự án ----------
  const projects = [
    {
      slug: "biet-thu-binh-duc",
      title: "Biệt thự Bình Đức",
      location: "P. Bình Đức, An Giang",
      description: "Thi công trọn bộ cửa đi, cửa sổ và lan can nhôm cho biệt thự hiện đại.",
      coverUrl: findProjectAsset("villa")
    },
    {
      slug: "khach-san-an-giang",
      title: "Khách sạn An Giang",
      location: "TP. Long Xuyên, An Giang",
      description: "Giải pháp nhôm kính đồng bộ cho mặt tiền và hệ thống cửa phòng khách sạn.",
      coverUrl: findProjectAsset("hotel")
    },
    {
      slug: "nha-pho-tran-hung-dao",
      title: "Nhà phố Trần Hưng Đạo",
      location: "P. Bình Đức, An Giang",
      description: "Lắp đặt cửa nhôm Xingfa Class A cho toàn bộ mặt tiền nhà phố.",
      coverUrl: findProjectAsset("townhouse")
    },
    {
      slug: "showroom-cong-thanh",
      title: "Showroom Công Thảnh",
      location: "Trần Hưng Đạo, An Giang",
      description: "Không gian trưng bày sản phẩm nhôm, phụ kiện và nội thất nhôm của CÔNG THẢNH.",
      coverUrl: findProjectAsset("showroom")
    }
  ];

  for (const project of projects) {
    const data = {
      title: project.title,
      location: project.location,
      description: project.description,
      coverUrl: project.coverUrl,
      status: PublishStatus.PUBLISHED
    };

    await prisma.project.upsert({
      where: { slug: project.slug },
      update: data,
      create: { ...data, slug: project.slug }
    });
  }

  // ---------- Banner trang chủ ----------
  const bannerData = {
    title: `${brandContent.hero.eyebrow} — ${brandContent.hero.title}`,
    subtitle: brandContent.intro.description,
    imageUrl: "/assets/banners/hero-homepage-v2.webp",
    buttonLabel: brandContent.hero.cta,
    buttonUrl: "/san-pham",
    sortOrder: 0,
    isActive: true
  };

  await prisma.banner.upsert({
    where: { slug: "trang-chu-hero" },
    update: bannerData,
    create: { ...bannerData, slug: "trang-chu-hero" }
  });

  console.log(
    "Seed hoàn tất: danh mục, thương hiệu, sản phẩm, dự án và banner trang chủ đã được đồng bộ."
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
