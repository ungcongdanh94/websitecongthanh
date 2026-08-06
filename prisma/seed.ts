import { PrismaClient, PublishStatus } from "@prisma/client";
import seedData from "../data/seed-data.json";
import companyContent from "../data/company-content.json";
import siteContent from "../data/site-content.json";
import seoContent from "../data/seo-content.json";
import siteAssets from "../data/site-assets.json";
import realCatalog from "../data/congthanh-real-catalog.json";

const prisma = new PrismaClient();

type SeedProduct = (typeof seedData.products)[number];

function findProjectAsset(keyword: string): string {
  const match = siteAssets.assets.projects.find((path) => path.includes(keyword));
  if (!match) throw new Error(`Không tìm thấy ảnh dự án khớp từ khoá: ${keyword}`);
  return match;
}

// Nhập catalog sản phẩm thật thu thập từ congthanhco.com (data/congthanh-real-catalog.json).
// Độc lập với phần seed mẫu ở trên — dùng slug ổn định, chỉ upsert, không xoá dữ liệu nào.
async function seedRealCatalog() {
  const categoryMap = new Map<string, string>();
  for (const item of realCatalog.categories) {
    const category = await prisma.category.upsert({
      where: { slug: item.slug },
      update: { name: item.name, description: item.description, sortOrder: item.sortOrder, isActive: true },
      create: { slug: item.slug, name: item.name, description: item.description, sortOrder: item.sortOrder }
    });
    categoryMap.set(item.slug, category.id);
  }

  const brandMap = new Map<string, string>();
  for (const item of realCatalog.brands) {
    const brand = await prisma.brand.upsert({
      where: { slug: item.slug },
      update: { name: item.name, isActive: true },
      create: { slug: item.slug, name: item.name }
    });
    brandMap.set(item.slug, brand.id);
  }

  for (const item of realCatalog.products) {
    const data = {
      name: item.name,
      shortDesc: "shortDesc" in item ? item.shortDesc : null,
      imageUrl: item.imageUrl,
      color: "color" in item ? item.color : null,
      thickness: "thickness" in item ? item.thickness : null,
      productLine: "productLine" in item ? item.productLine : null,
      aluminumSystem: "aluminumSystem" in item ? item.aluminumSystem : null,
      specs: "specs" in item ? item.specs : undefined,
      status: PublishStatus.PUBLISHED,
      categoryId: categoryMap.get(item.category)!,
      brandId: item.brand ? brandMap.get(item.brand) ?? null : null
    };

    await prisma.product.upsert({
      where: { slug: item.slug },
      update: data,
      create: {
        ...data,
        slug: item.slug,
        description: "Dữ liệu thật thu thập từ congthanhco.com — cập nhật lại nếu cần qua trang quản trị."
      }
    });
  }

  console.log(
    `Đã nhập catalog thật: ${realCatalog.categories.length} danh mục, ${realCatalog.brands.length} thương hiệu, ${realCatalog.products.length} sản phẩm từ congthanhco.com.`
  );
}

async function main() {
  // ---------- Danh mục ----------
  const categoryMap = new Map<string, string>();

  for (const item of seedData.categories) {
    const category = await prisma.category.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        sortOrder: item.sortOrder,
        isActive: true
      },
      create: {
        slug: item.slug,
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        sortOrder: item.sortOrder,
        isActive: true
      }
    });
    categoryMap.set(item.slug, category.id);
  }

  // ---------- Thương hiệu ----------
  const brandMap = new Map<string, string>();

  for (const item of seedData.brands) {
    const logoUrl = "logoUrl" in item ? item.logoUrl : null;
    const brand = await prisma.brand.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        logoUrl,
        isActive: true
      },
      create: {
        slug: item.slug,
        name: item.name,
        description: item.description,
        logoUrl,
        isActive: true
      }
    });
    brandMap.set(item.slug, brand.id);
  }

  // ---------- Sản phẩm ----------
  // Dữ liệu sản phẩm (SKU, mô tả chi tiết) lấy từ data/seed-data.json.
  for (const item of seedData.products as SeedProduct[]) {
    const data = {
      name: item.name,
      sku: item.sku,
      shortDesc: item.shortDesc,
      description: item.description,
      imageUrl: item.imageUrl,
      gallery: "gallery" in item && item.gallery ? item.gallery : undefined,
      unit: item.unit,
      productLine: "productLine" in item ? item.productLine : null,
      aluminumSystem: "aluminumSystem" in item ? item.aluminumSystem : null,
      color: "color" in item ? item.color : null,
      thickness: "thickness" in item ? item.thickness : null,
      stockLength: "stockLength" in item ? item.stockLength : null,
      specs: item.specs,
      isFeatured: item.isFeatured,
      status: PublishStatus.PUBLISHED,
      categoryId: categoryMap.get(item.category)!,
      brandId: brandMap.get(item.brand) ?? null
    };

    await prisma.product.upsert({
      where: { slug: item.slug },
      update: data,
      create: { ...data, slug: item.slug }
    });
  }

  // ---------- Banner trang chủ & khuyến mãi ----------
  // Dùng slug ổn định (đã gán sẵn trong data/seed-data.json) để upsert an toàn,
  // thay vì đối chiếu theo tiêu đề (dễ tạo trùng nếu tiêu đề thay đổi sau này).
  for (const item of seedData.banners) {
    const { slug, ...bannerData } = item;
    await prisma.banner.upsert({
      where: { slug },
      update: bannerData,
      create: { ...bannerData, slug }
    });
  }

  // ---------- Dự án ----------
  // Bộ nội dung mới có kèm 2 dự án mẫu (trạng thái DRAFT, ảnh minh hoạ, chưa phải công trình
  // thực tế — xem README của content pack). Vì đã có 4 dự án thật (PUBLISHED, ảnh thật) từ
  // trước, ở đây chủ động BỎ QUA 2 dự án mẫu đó để tránh trộn dữ liệu placeholder vào trang
  // công khai. Giữ lại đoạn dưới đây phòng khi cần đối chiếu ảnh dự án theo từ khoá.
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

  // ---------- Cài đặt nội dung (Setting) ----------
  // Lưu sẵn nội dung công ty / trang chủ / SEO dạng key-value để dùng dần về sau
  // (hiện các trang trong code vẫn dùng nội dung tĩnh; đây là dữ liệu chuẩn bị trước).
  const settings = [
    ["company", companyContent],
    ["siteContent", siteContent],
    ["seo", seoContent]
  ] as const;

  for (const [key, value] of settings) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  }

  await seedRealCatalog();

  console.log(
    "Seed hoàn tất: danh mục, thương hiệu, sản phẩm, banner, dự án và cài đặt nội dung đã được đồng bộ."
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
