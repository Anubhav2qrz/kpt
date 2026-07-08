import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { ChatProvider } from "@/components/chat/ChatContext";
import { Inter, Outfit } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kishore Plus Tutorial — Expert Physics Coaching",
  description:
    "Premium physics coaching for Class 9, 10, 11, 12, JEE & NEET by Kishore Sir. Watch free video lectures, download notes, and practice daily questions.",
  keywords: "physics tutor, JEE physics, NEET physics, class 9 physics, class 10 physics, class 11 physics, class 12 physics, Kishore Plus Tutorial",
  openGraph: {
    title: "Kishore Plus Tutorial",
    description: "Expert Physics Coaching for Class 9–12, JEE & NEET",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body
        className="min-h-screen antialiased"
        style={{ backgroundColor: "var(--kpt-bg)", color: "var(--kpt-text)" }}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ChatProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster position="top-right" richColors />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}





