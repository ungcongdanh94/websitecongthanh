import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

const statusLabel: Record<string, string> = {
  DRAFT: "Bản nháp",
  PUBLISHED: "Công khai",
  ARCHIVED: "Lưu trữ"
};

export async function GET() {
  if (!(await getAdminSession())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: { category: true, brand: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }]
  });

  const rows = products.map((product) => ({
    SKU: product.sku || "",
    "Tên sản phẩm": product.name,
    Slug: product.slug,
    "Danh mục": product.category.name,
    "Thương hiệu": product.brand?.name || "",
    "Dòng sản phẩm": product.productLine || "",
    "Hệ nhôm": product.aluminumSystem || "",
    Màu: product.color || "",
    "Độ dày": product.thickness || "",
    "Chiều dài thanh": product.stockLength || "",
    "Đơn vị": product.unit || "",
    "Giá bán": product.price === null ? "" : Number(product.price),
    "Giá đại lý": product.dealerPrice === null ? "" : Number(product.dealerPrice),
    "Trạng thái": statusLabel[product.status] || product.status,
    "Nổi bật": product.isFeatured ? "Có" : "",
    "Mô tả ngắn": product.shortDesc || ""
  }));

  const sheet = XLSX.utils.json_to_sheet(rows);
  sheet["!cols"] = [
    { wch: 16 }, { wch: 32 }, { wch: 24 }, { wch: 18 }, { wch: 16 },
    { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 14 },
    { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 40 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "San pham");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="san-pham-cong-thanh-${new Date().toISOString().slice(0, 10)}.xlsx"`
    }
  });
}
