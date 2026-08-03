import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

function csvCell(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  if (!(await getAdminSession())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: { category: true, brand: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }]
  });

  const rows = [
    ["SKU", "Tên sản phẩm", "Danh mục", "Thương hiệu", "Hệ nhôm", "Màu", "Đơn vị", "Giá bán", "Giá đại lý"],
    ...products.map((product) => [
      product.sku || "",
      product.name,
      product.category.name,
      product.brand?.name || "",
      product.aluminumSystem || "",
      product.color || "",
      product.unit || "",
      product.price === null ? "" : Number(product.price),
      product.dealerPrice === null ? "" : Number(product.dealerPrice)
    ])
  ];

  const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bang-gia-cong-thanh-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  });
}
