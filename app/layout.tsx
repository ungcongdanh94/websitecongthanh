import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AiAdvisorWidget from "@/components/AiAdvisorWidget";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-be-vietnam-pro"
});

export const metadata: Metadata = {
  title: "CÔNG THẢNH | Nhôm và phụ kiện cao cấp",
  description:
    "Tham khảo sản phẩm, giá nhôm, phụ kiện và giải pháp nội thất nhôm tại CÔNG THẢNH."
};

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
