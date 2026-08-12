import { z } from "zod";

export const quoteRequestSchema = z.object({
  customerName: z.string().trim().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().trim().min(8, "Số điện thoại chưa hợp lệ").max(20),
  email: z.string().trim().email("Email chưa hợp lệ").optional().or(z.literal("")),
  company: z.string().trim().max(150).optional(),
  note: z.string().trim().max(2000).optional(),
  productName: z.string().trim().max(200).optional(),
  quantity: z.coerce.number().positive().optional(),
  unit: z.string().trim().max(30).optional(),
  sourceUrl: z.string().trim().max(500).optional()
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

// ---------- Sprint F: validate input cho các route admin quan trọng ----------

const optionalTrimmed = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const productSchema = z.object({
  name: z.string().trim().min(2, "Tên sản phẩm quá ngắn").max(200),
  slug: z.string().trim().min(2, "Slug quá ngắn").max(200).regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và gạch ngang"),
  categoryId: z.string().trim().min(1, "Vui lòng chọn danh mục"),
  brandId: z.string().trim().optional().or(z.literal("")),
  sku: optionalTrimmed(60),
  shortDesc: optionalTrimmed(300),
  description: z.string().trim().max(10000).optional().or(z.literal("")),
  imageUrl: optionalTrimmed(500),
  price: z.coerce.number().nonnegative().optional().or(z.literal("")),
  dealerPrice: z.coerce.number().nonnegative().optional().or(z.literal("")),
  unit: optionalTrimmed(30),
  productLine: optionalTrimmed(100),
  aluminumSystem: optionalTrimmed(100),
  color: optionalTrimmed(300),
  thickness: optionalTrimmed(100),
  stockLength: optionalTrimmed(100),
  catalogUrl: optionalTrimmed(500),
  videoUrl: optionalTrimmed(500),
  warrantyPolicy: z.string().trim().max(2000).optional().or(z.literal("")),
  seoTitle: optionalTrimmed(70),
  seoDescription: optionalTrimmed(200),
  ogImage: optionalTrimmed(500)
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Tên danh mục quá ngắn").max(100),
  slug: z.string().trim().min(2, "Slug quá ngắn").max(100).regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và gạch ngang"),
  description: optionalTrimmed(500)
});

export const brandSchema = z.object({
  name: z.string().trim().min(1, "Tên thương hiệu quá ngắn").max(100),
  slug: z.string().trim().min(1, "Slug quá ngắn").max(100).regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và gạch ngang"),
  description: optionalTrimmed(500),
  logoUrl: optionalTrimmed(500)
});
