import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AnimationProvider from "@/components/AnimationProvider";
import ThemeProvider from "@/components/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="selection-red min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-inter relative overflow-x-hidden">
        {/* Global Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-surface)] via-[var(--bg-primary)] to-[var(--bg-surface-alt)]" />
          <div className="absolute top-0 left-0 w-[1px] h-[1px] bg-transparent stars-1 opacity-15 dark:opacity-20 animate-[animStar_50s_linear_infinite]" />
          <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-transparent stars-2 opacity-15 dark:opacity-20 animate-[animStar_80s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-red)]/[0.02] dark:bg-[var(--accent-red)]/[0.035] rounded-full blur-[140px]" />
          <div
            className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,black_40%,transparent_80%)]"
            style={{
              backgroundImage:
                "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Top Blur Header */}
        <div className="gradient-blur" />

        <ThemeProvider>
          <AnimationProvider>
            {children}
          </AnimationProvider>
        </ThemeProvider>

        <Script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}

