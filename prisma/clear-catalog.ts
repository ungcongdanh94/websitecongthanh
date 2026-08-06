import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Báo giá cũ có thể đang tham chiếu tới sản phẩm — gỡ liên kết trước (giữ nguyên
  // productName/giá đã lưu trong QuoteItem, không mất dữ liệu báo giá, chỉ bỏ link).
  const unlinked = await prisma.quoteItem.updateMany({
    where: { productId: { not: null } },
    data: { productId: null }
  });

  const products = await prisma.product.deleteMany({});
  // PriceChange tự xoá theo (onDelete: Cascade) khi Product bị xoá.

  const categories = await prisma.category.deleteMany({});
  const brands = await prisma.brand.deleteMany({});

  console.log(
    `Đã xoá sạch: ${products.count} sản phẩm, ${categories.count} danh mục, ${brands.count} thương hiệu. ` +
      `Đã gỡ liên kết sản phẩm khỏi ${unlinked.count} dòng báo giá cũ (báo giá vẫn giữ nguyên, không bị xoá).`
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
