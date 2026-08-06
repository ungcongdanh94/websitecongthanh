import { PrismaClient, PublishStatus } from "@prisma/client";
import seedData from "../data/seed-data.json";
import companyContent from "../data/company-content.json";
import siteContent from "../data/site-content.json";
import seoContent from "../data/seo-content.json";
import siteAssets from "../data/site-assets.json";

const prisma = new PrismaClient();

function findProjectAsset(keyword: string): string {
  const match = siteAssets.assets.projects.find((path) => path.includes(keyword));
  if (!match) throw new Error(`Không tìm thấy ảnh dự án khớp từ khoá: ${keyword}`);
  return match;
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

  console.log("Seed hoàn tất: banner, dự án và cài đặt nội dung đã được đồng bộ (không seed sản phẩm/danh mục/thương hiệu).");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
