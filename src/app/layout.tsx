import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Italiana } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const italiana = Italiana({
  subsets: ["latin"],
  variable: "--font-italiana",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Viva RGC",
    default: "Viva RGC | Luxury Rhythmic Gymnastics in Toronto",
  },
  description: "Beginner-friendly and competition-driven rhythmic gymnastics programs focused on confidence, artistry, and athletic excellence.",
  metadataBase: new URL("https://vivargc.com"), // Placeholder URL
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={cn(
          inter.variable,
          cormorant.variable,
          italiana.variable,
          "antialiased min-h-screen flex flex-col"
        )}
      >
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
