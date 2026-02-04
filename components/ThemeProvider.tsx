"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  pendingTheme: Theme;
  toggleTheme: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [pendingTheme, setPendingTheme] = useState<Theme>("dark");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      setPendingTheme(savedTheme);
    }
  }, []);

  // Apply theme to document and update favicon
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);

      // Update favicon - always white for both modes
      const updateFavicon = () => {
        const favicon = document.querySelector(
          "link[rel='icon']",
        ) as HTMLLinkElement;
        const appleTouchIcon = document.querySelector(
          "link[rel='apple-touch-icon']",
        ) as HTMLLinkElement;

        const originalLogoPath = "/assets/logo_lambang_dareean.png";

        // Always create white/inverted version for both themes
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.width;
          canvas.height = img.height;

          if (ctx) {
            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Invert colors to make it white
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height,
            );
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
              data[i] = 255 - data[i]; // Red
              data[i + 1] = 255 - data[i + 1]; // Green
              data[i + 2] = 255 - data[i + 2]; // Blue
              // Alpha channel (i + 3) remains unchanged
            }

            ctx.putImageData(imageData, 0, 0);

            // Convert canvas to data URL
            const invertedUrl = canvas.toDataURL("image/png");

            if (favicon) favicon.href = invertedUrl;
            if (appleTouchIcon) appleTouchIcon.href = invertedUrl;
          }
        };
        img.src = originalLogoPath;
      };

      updateFavicon();
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    // Set pending theme immediately (for wave color)
    setPendingTheme(newTheme);
    setIsTransitioning(true);

    // Change actual theme when wave is at 50% - covering the entire viewport
    setTimeout(() => {
      setTheme(newTheme);
    }, 375);

    // End transition when wave has fully passed (match animation duration)
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          theme: "dark",
          pendingTheme: "dark",
          toggleTheme: () => {},
          isTransitioning: false,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{ theme, pendingTheme, toggleTheme, isTransitioning }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
