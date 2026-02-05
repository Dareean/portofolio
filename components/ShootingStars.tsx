"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  angle: number;
}

export default function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);
  const { theme } = useTheme();
  
  // Theme-aware colors
  const starColor = theme === "dark" ? "white" : "black";
  const starGlow = theme === "dark" 
    ? "0 0 10px 3px white, 0 0 20px 6px rgba(255,255,255,0.5)"
    : "0 0 10px 3px black, 0 0 20px 6px rgba(0,0,0,0.3)";
  const trailGradient = theme === "dark"
    ? "linear-gradient(to left, white, rgba(255,255,255,0.5), transparent)"
    : "linear-gradient(to left, black, rgba(0,0,0,0.5), transparent)";

  useEffect(() => {
    // Create a shooting star
    const createStar = (): Star => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 50,
      size: Math.random() * 2 + 2,
      duration: Math.random() * 0.8 + 0.5,
      angle: 45,
    });

    // Initial stars
    setStars([createStar(), createStar()]);

    // Add new stars periodically
    const interval = setInterval(() => {
      setStars(prev => [...prev.slice(-4), createStar()]);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {stars.map((star) => (
        <motion.div
          key={star.id}
          style={{
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            backgroundColor: starColor,
            boxShadow: starGlow,
          }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ 
            x: 300, 
            y: 300, 
            opacity: [1, 1, 0],
          }}
          transition={{ 
            duration: star.duration, 
            ease: "linear",
          }}
        >
          {/* Trail */}
          <div
            style={{
              position: "absolute",
              width: 80,
              height: 2,
              background: trailGradient,
              transform: "rotate(-135deg)",
              transformOrigin: "right center",
              right: star.size / 2,
              top: star.size / 2 - 1,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
