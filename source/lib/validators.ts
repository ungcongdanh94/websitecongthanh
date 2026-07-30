import { z } from "zod";

export const quoteRequestSchema = z.object({
  customerName: z.string().trim().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().trim().min(8, "Số điện thoại chưa hợp lệ").max(20),
  email: z.string().trim().email("Email chưa hợp lệ").optional().or(z.literal("")),
  company: z.string().trim().max(150).optional(),
  note: z.string().trim().max(2000).optional(),
  productName: z.string().trim().max(200).optional(),
  quantity: z.coerce.number().positive().optional(),
  unit: z.string().trim().max(30).optional()
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
