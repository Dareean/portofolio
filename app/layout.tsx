import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import LoadingScreen from "@/components/LoadingScreen";
import IntroTransition from "@/components/IntroTransition";
import { ThemeProvider } from "@/components/ThemeProvider";
import WaveTransition from "@/components/WaveTransition";
import TopNav from "@/components/TopNav";
import RecruiterAIAssistant from "@/components/RecruiterAIAssistant";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-notion",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dareean · Portfolio",
  description:
    "Full-stack developer & UI/UX enthusiast from Palu, Indonesia. Crafting digital experiences that bridge code and creativity.",
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
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans bg-canvas text-ink selection:bg-primary/20 selection:text-ink antialiased`}
      >
        <ThemeProvider>
          <IntroTransition />
          <WaveTransition />
          <LoadingScreen />
          <TopNav />
          <SmoothScroll>{children}</SmoothScroll>
          <RecruiterAIAssistant />
          <div className="noise-bg" />
        </ThemeProvider>
      </body>
    </html>
  );
}
