import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

type ImportRow = {
  SKU?: string;
  "Tên sản phẩm"?: string;
  Slug?: string;
  "Danh mục"?: string;
  "Thương hiệu"?: string;
  "Hệ nhôm"?: string;
  Màu?: string;
  "Độ dày"?: string;
  "Chiều dài thanh"?: string;
  "Đơn vị"?: string;
  "Giá bán"?: number | string;
  "Giá đại lý"?: number | string;
  "Mô tả ngắn"?: string;
  "Trạng thái"?: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

    if (!file || typeof file === "string") {
      return NextResponse.json({ ok: false, message: "Chưa chọn file" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return NextResponse.json({ ok: false, message: "File không có dữ liệu" }, { status: 400 });
    }

    const rawRows = XLSX.utils.sheet_to_json<ImportRow>(workbook.Sheets[firstSheetName], { defval: "" });
    if (!rawRows.length) {
      return NextResponse.json({ ok: false, message: "Không đọc được dòng nào trong file" }, { status: 400 });
    }

    const categories = await prisma.category.findMany({ select: { slug: true, name: true } });
    const brands = await prisma.brand.findMany({ select: { slug: true, name: true } });

    const findCategorySlug = (value: string) => {
      const match = categories.find(
        (c) => c.slug === value.trim() || c.name.toLowerCase() === value.trim().toLowerCase()
      );
      return match?.slug;
    };
    const findBrandSlug = (value: string) => {
      const match = brands.find(
        (b) => b.slug === value.trim() || b.name.toLowerCase() === value.trim().toLowerCase()
      );
      return match?.slug;
    };

    const preview = rawRows.map((row: ImportRow, index: number) => {
      const errors: string[] = [];
      const name = String(row["Tên sản phẩm"] || "").trim();
      const categoryInput = String(row["Danh mục"] || "").trim();
      const categorySlug = categoryInput ? findCategorySlug(categoryInput) : undefined;
      const brandInput = String(row["Thương hiệu"] || "").trim();
      const brandSlug = brandInput ? findBrandSlug(brandInput) : undefined;
      const status = String(row["Trạng thái"] || "").trim().toLowerCase();

      if (!name) errors.push("Thiếu tên sản phẩm");
      if (!categoryInput) errors.push("Thiếu danh mục");
      else if (!categorySlug) errors.push(`Không tìm thấy danh mục "${categoryInput}"`);
      if (brandInput && !brandSlug) errors.push(`Không tìm thấy thương hiệu "${brandInput}"`);

      const slug = String(row.Slug || "").trim() || (name ? slugify(name) : "");

      return {
        rowNumber: index + 2,
        valid: errors.length === 0,
        errors,
        data: {
          sku: String(row.SKU || "").trim() || null,
          name,
          slug,
          categorySlug: categorySlug || null,
          brandSlug: brandSlug || null,
          aluminumSystem: String(row["Hệ nhôm"] || "").trim() || null,
          color: String(row["Màu"] || "").trim() || null,
          thickness: String(row["Độ dày"] || "").trim() || null,
          stockLength: String(row["Chiều dài thanh"] || "").trim() || null,
          unit: String(row["Đơn vị"] || "").trim() || null,
          price: parseNumberCell(row["Giá bán"]) ?? null,
          dealerPrice: parseNumberCell(row["Giá đại lý"]) ?? null,
          shortDesc: String(row["Mô tả ngắn"] || "").trim() || null,
          status: status === "công khai" || status === "publish" ? "PUBLISHED" : "DRAFT"
        }
      };
    });

    const validCount = preview.filter((r) => r.valid).length;

    return NextResponse.json({
      ok: true,
      total: preview.length,
      validCount,
      invalidCount: preview.length - validCount,
      rows: preview
    });
  } catch (error) {
    console.error("IMPORT_PREVIEW_ERROR", error);
    return NextResponse.json({ ok: false, message: "Không thể đọc hoặc xử lý file" }, { status: 500 });
  }
}
