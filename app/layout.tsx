import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AiAdvisorWidget from "@/components/AiAdvisorWidget";
import FloatingContact from "@/components/FloatingContact";
import { prisma } from "@/lib/prisma";
import companyContent from "@/data/company-content.json";

const SITE_URL_FOR_SCHEMA = process.env.NEXT_PUBLIC_SITE_URL || "https://congthanhco.com";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: companyContent.companyName,
  legalName: companyContent.legalName,
  url: SITE_URL_FOR_SCHEMA,
  address: {
    "@type": "PostalAddress",
    streetAddress: companyContent.address,
    addressRegion: "An Giang",
    addressCountry: "VN"
  },
  ...(companyContent.hotline ? { telephone: companyContent.hotline } : {})
};

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-be-vietnam-pro"
});

const DEFAULT_TITLE = "CÔNG THẢNH | Nhôm và phụ kiện cao cấp";
const DEFAULT_DESCRIPTION =
  "Tham khảo sản phẩm, giá nhôm, phụ kiện và giải pháp nội thất nhôm tại CÔNG THẢNH.";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://congthanhco.com";

export async function generateMetadata(): Promise<Metadata> {
  // Đọc tiêu đề/mô tả trang chủ từ bảng Setting (đã seed sẵn ở data/seo-content.json).
  // Nếu chưa seed hoặc lỗi kết nối DB, dùng lại nội dung mặc định — không để trang chủ lỗi.
  const base: Metadata = {
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: "CÔNG THẢNH"
    }
  };

  try {
    const seoSetting = await prisma.setting.findUnique({ where: { key: "seo" } });
    const home = (seoSetting?.value as { home?: { title?: string; description?: string } } | null)?.home;
    const title = home?.title || DEFAULT_TITLE;
    const description = home?.description || DEFAULT_DESCRIPTION;
    return { ...base, title, description, openGraph: { ...base.openGraph, title, description } };
  } catch {
    return { ...base, title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION };
  }
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className={beVietnamPro.className}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <AiAdvisorWidget />
        <FloatingContact />
      </body>
    </html>
  );
}
