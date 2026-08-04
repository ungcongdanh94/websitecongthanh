import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AiAdvisorWidget from "@/components/AiAdvisorWidget";
import { prisma } from "@/lib/prisma";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-be-vietnam-pro"
});

const DEFAULT_TITLE = "CÔNG THẢNH | Nhôm và phụ kiện cao cấp";
const DEFAULT_DESCRIPTION =
  "Tham khảo sản phẩm, giá nhôm, phụ kiện và giải pháp nội thất nhôm tại CÔNG THẢNH.";

export async function generateMetadata(): Promise<Metadata> {
  // Đọc tiêu đề/mô tả trang chủ từ bảng Setting (đã seed sẵn ở data/seo-content.json).
  // Nếu chưa seed hoặc lỗi kết nối DB, dùng lại nội dung mặc định — không để trang chủ lỗi.
  try {
    const seoSetting = await prisma.setting.findUnique({ where: { key: "seo" } });
    const home = (seoSetting?.value as { home?: { title?: string; description?: string } } | null)?.home;
    return {
      title: home?.title || DEFAULT_TITLE,
      description: home?.description || DEFAULT_DESCRIPTION
    };
  } catch {
    return { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
  }
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className={beVietnamPro.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <AiAdvisorWidget />
      </body>
    </html>
  );
}
