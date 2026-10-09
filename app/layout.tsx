import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ایمپورت کردن هدر و فوتر ساخته شده
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { MotionProvider } from "../components/motion/MotionProvider";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Amir Hossein Talebi Alborz — Senior UX Designer",
    template: "%s — Amir Hossein Talebi",
  },
  description:
    "Senior UX Designer and Information Architect crafting clear, structured, human-centred digital products.",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
      // globals.css sets smooth scrolling for in-page anchors; this tells Next.js to switch it
      // off during route changes so new pages start at the top instantly.
      data-scroll-behavior="smooth"
    >
      <body className="relative min-h-dvh w-full overflow-x-clip bg-background font-sans text-muted antialiased">
        {/* اسکیپ لینک برای دسترسی‌پذیری و کیبورد */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-accent-foreground"
        >
          Skip to content
        </a>

        {/* هاله‌های نوری پس‌زمینه */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-[-20%] h-[640px] w-[960px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-[140px]" />
          <div className="absolute bottom-[-25%] right-[-10%] h-[520px] w-[520px] rounded-full bg-surface-raised/40 blur-[120px]" />
        </div>

        {/* ساختار فلکس برای چسباندن فوتر به پایین صفحه */}
        {/* overflow-x-clip (not hidden) trims stray horizontal overflow without creating a
            scroll container, so position: sticky keeps working for the header and case studies. */}
        <MotionProvider>
          <div className="relative flex min-h-dvh w-full flex-col overflow-x-clip">
            <Header />
            <main id="content" className="w-full min-w-0 flex-1 overflow-x-clip">
              {children}
            </main>
            <Footer />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}