import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CÔNG THẢNH | Nhôm & Phụ kiện cao cấp",
  description: "Tham khảo sản phẩm, giá nhôm, phụ kiện và giải pháp nội thất nhôm tại CÔNG THẢNH."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
