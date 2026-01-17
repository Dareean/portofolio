import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Dareean - Logic meets Creativity",
  description: "Logic meets Aesthetics. Portfolio of Dareean.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${syne.variable} font-sans bg-void-black text-off-white selection:bg-off-white selection:text-void-black antialiased`}
      >
        <LoadingScreen />
        <Navbar />
        <SmoothScroll>{children}</SmoothScroll>
        <div className="noise-bg" />
      </body>
    </html>
  );
}
