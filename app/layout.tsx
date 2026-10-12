import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AnimationProvider from "@/components/AnimationProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "e-Yantra MSIT | Think. Build. Innovate.",
  description: "Engineering Lab & Robotics Community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="selection-red min-h-screen bg-[#FAFAF8] text-[#111214] font-inter relative overflow-x-hidden">
        {/* Global Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#FAFAF8] to-[#F3F3F0]"></div>
            <div className="absolute top-0 left-0 w-[1px] h-[1px] bg-transparent stars-1 opacity-15 animate-[animStar_50s_linear_infinite]"></div>
            <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-transparent stars-2 opacity-15 animate-[animStar_80s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d83a32]/[0.02] rounded-full blur-[140px]"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(17,18,20,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(17,18,20,0.035)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_80%)]"></div>
        </div>

        {/* Top Blur Header */}
        <div className="gradient-blur"></div>

        <AnimationProvider>
          {children}
        </AnimationProvider>

        <Script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
