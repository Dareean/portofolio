import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import LoadingScreen from "@/components/LoadingScreen";
import IntroTransition from "@/components/IntroTransition";
import { ThemeProvider } from "@/components/ThemeProvider";
import WaveTransition from "@/components/WaveTransition";
import FixedLogo from "@/components/FixedLogo";
import ShootingStars from "@/components/ShootingStars";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Dareean - Portfolio",
  description:
    "Bringing stories to life, one pixel at a time. Portfolio of Dareean.",
  icons: {
    icon: "/assets/logo_lambang_dareean.png",
    apple: "/assets/logo_lambang_dareean.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${syne.variable} font-sans bg-void-black text-off-white selection:bg-off-white selection:text-void-black antialiased`}
      >
        <ThemeProvider>
          <ShootingStars />
          <IntroTransition />
          <WaveTransition />
          <LoadingScreen />
          <FixedLogo />
          <SmoothScroll>{children}</SmoothScroll>
          <div className="noise-bg" />
        </ThemeProvider>
      </body>
    </html>
  );
}
