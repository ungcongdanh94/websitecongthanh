import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

type ImportRow = {
  SKU?: string;
  "Tên sản phẩm"?: string;
  "Giá bán"?: number | string;
  "Giá đại lý"?: number | string;
};

function parseNumberCell(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
}

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ ok: false, message: "Chưa đăng nhập" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, message: "Chưa chọn file" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return NextResponse.json({ ok: false, message: "File không có dữ liệu" }, { status: 400 });
    }

    const rows = XLSX.utils.sheet_to_json<ImportRow>(workbook.Sheets[firstSheetName], { defval: "" });

    if (!rows.length) {
      return NextResponse.json({ ok: false, message: "Không đọc được dòng nào trong file" }, { status: 400 });
    }

    const skipped: { row: number; reason: string }[] = [];
    let updatedCount = 0;

    await prisma.$transaction(async (tx) => {
      for (let index = 0; index < rows.length; index += 1) {
        const row = rows[index];
        const sku = String(row["SKU"] || "").trim();
        const name = String(row["Tên sản phẩm"] || "").trim();
        const newPrice = parseNumberCell(row["Giá bán"]);
        const newDealerPrice = parseNumberCell(row["Giá đại lý"]);

        if (!sku && !name) {
          skipped.push({ row: index + 2, reason: "Thiếu SKU và tên sản phẩm" });
          continue;
        }

        if (newPrice === undefined && newDealerPrice === undefined) {
          skipped.push({ row: index + 2, reason: "Không có giá nào để cập nhật" });
          continue;
        }

        const product = sku
          ? await tx.product.findUnique({ where: { sku } })
          : await tx.product.findFirst({ where: { name: { equals: name, mode: "insensitive" } } });

        if (!product) {
          skipped.push({ row: index + 2, reason: `Không tìm thấy sản phẩm (${sku || name})` });
          continue;
        }

        await tx.product.update({
          where: { id: product.id },
          data: {
            price: newPrice !== undefined ? newPrice : undefined,
            dealerPrice: newDealerPrice !== undefined ? newDealerPrice : undefined
          }
        });

        await tx.priceChange.create({
          data: {
            productId: product.id,
            oldPrice: product.price,
            newPrice: newPrice !== undefined ? newPrice : product.price,
            oldDealerPrice: product.dealerPrice,
            newDealerPrice: newDealerPrice !== undefined ? newDealerPrice : product.dealerPrice,
            note: `Nhập từ file: ${file.name}`
          }
        });

        updatedCount += 1;
      }
    });

    return NextResponse.json({ ok: true, updatedCount, total: rows.length, skipped });
  } catch (error) {
    console.error("IMPORT_PRICES_ERROR", error);
    return NextResponse.json({ ok: false, message: "Không thể đọc hoặc xử lý file" }, { status: 500 });
  }
}
