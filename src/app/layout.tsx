import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SecurityLayer from "@/components/layout/SecurityLayer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Synapse | Educational AI Portal",
    template: "%s | Synapse AI Portal",
  },
  description:
    "An interactive educational portal exploring the history, science, and future of artificial intelligence — with live AI tools powered by Gemini.",
  keywords: ["AI", "machine learning", "deep learning", "LLM", "coding assistant", "education"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-white selection:bg-accent-primary/30 selection:text-accent-primary">
        <SecurityLayer />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
