import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-pretendard",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "청소 잘하는 남자 | 공간의 가치를 높이다",
  description:
    "전문 청소 서비스 예약부터 현장 관리까지, 클린 펄스가 함께합니다. 입주 청소, 에어컨 분해세척, 사무실 청소 등 믿을 수 있는 청소 전문가를 만나보세요.",
  keywords: ["청소", "입주청소", "에어컨세척", "청소업체", "청소 잘하는 남자"],
  manifest: "/manifest.json",
  themeColor: "#0ea5e9",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "청잘남",
  },
  openGraph: {
    title: "청소 잘하는 남자 | 공간의 가치를 높이다",
    description: "전문 청소 서비스 예약부터 현장 관리까지",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
