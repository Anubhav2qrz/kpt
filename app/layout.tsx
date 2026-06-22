import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Kishore Plus Tutorial — Expert Physics Coaching",
  description:
    "Premium physics coaching for Class 11, Class 12, JEE & NEET by Kishore Sir. Watch free video lectures, download notes, and practice daily questions.",
  keywords: "physics tutor, JEE physics, NEET physics, class 11 physics, class 12 physics, Kishore Plus Tutorial",
  openGraph: {
    title: "Kishore Plus Tutorial",
    description: "Expert Physics Coaching for JEE & NEET",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080f2a] text-[#e8eeff] antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
