import { PrismaClient, PublishStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: "nhom-thanh" },
    update: {},
    create: {
      name: "Nhôm thanh",
      slug: "nhom-thanh",
      description: "Các hệ nhôm thanh dùng cho cửa và công trình."
    }
  });

  const brand = await prisma.brand.upsert({
    where: { slug: "xingfa-class-a" },
    update: {},
    create: {
      name: "Xingfa Class A",
      slug: "xingfa-class-a"
    }
  });

  await prisma.product.upsert({
    where: { slug: "nhom-xingfa-class-a-he-55" },
    update: {},
    create: {
      name: "Nhôm Xingfa Class A hệ 55",
      slug: "nhom-xingfa-class-a-he-55",
      shortDesc: "Hệ nhôm cao cấp cho cửa đi và cửa sổ.",
      description: "Dữ liệu mẫu ban đầu cho CÔNG THẢNH.",
      price: 158000,
      unit: "kg",
      status: PublishStatus.PUBLISHED,
      isFeatured: true,
      categoryId: category.id,
      brandId: brand.id,
      specs: {
        system: "55",
        length: "6 m",
        application: "Cửa đi, cửa sổ"
      }
    }
  });

  console.log("Seed hoàn tất");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
