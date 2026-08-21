import { PrismaClient, PublishStatus } from "@prisma/client";
import seedData from "../data/seed-data.json";
import companyContent from "../data/company-content.json";
import siteContent from "../data/site-content.json";
import seoContent from "../data/seo-content.json";
import siteAssets from "../data/site-assets.json";
import realCatalog from "../data/congthanh-real-catalog.json";

const prisma = new PrismaClient();

function findProjectAsset(keyword: string): string {
  const match = siteAssets.assets.projects.find((path) => path.includes(keyword));
  if (!match) throw new Error(`Không tìm thấy ảnh dự án khớp từ khoá: ${keyword}`);
  return match;
}

// Catalog sản phẩm thật thu thập từ congthanhco.com (Sprint A — data/congthanh-real-catalog.json).
// Có SKU chuẩn hóa (tự sinh có quy tắc theo brand/hệ nhôm — site gốc không công khai SKU nào,
// Zen đổi lại qua CMS nếu công ty đã có hệ SKU nội bộ riêng). Chỉ upsert theo slug, không xoá dữ liệu.
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
      sku: item.sku,
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

  // Dọn 3 danh mục lớn cũ (Cửa Nhôm / Cửa Kính / Cửa Kéo - Cửa Cuốn) — đã tách thành
  // 15 danh mục con chi tiết đúng cấu trúc thật của web cũ, sản phẩm đã được gán lại ở
  // trên. Chỉ xóa nếu không còn sản phẩm nào trỏ vào (an toàn — không xóa nhầm nếu có
  // dữ liệu Zen tự thêm tay vào đó).
  const obsoleteCategorySlugs = ["cua-nhom", "cua-kinh", "cua-keo-cua-cuon"];
  for (const slug of obsoleteCategorySlugs) {
    const category = await prisma.category.findUnique({ where: { slug }, include: { _count: { select: { products: true } } } });
    if (category && category._count.products === 0) {
      await prisma.category.delete({ where: { slug } });
      console.log(`Đã xóa danh mục lớn cũ không còn dùng: ${slug}`);
    }
  }

  console.log(
    `Đã nhập catalog thật: ${realCatalog.categories.length} danh mục, ${realCatalog.brands.length} thương hiệu, ${realCatalog.products.length} sản phẩm từ congthanhco.com.`
  );
}

async function main() {
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

  console.log("Seed hoàn tất: banner, dự án, cài đặt nội dung và catalog sản phẩm thật đã được đồng bộ.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
