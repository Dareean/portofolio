"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDeviceType } from "@/lib/hooks";
import { useTheme } from "./ThemeProvider";

// Dynamic import Three.js only on client side
let THREE: typeof import("three") | null = null;

export default function FloatingGeometry() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const deviceInfo = useDeviceType();
  const { theme } = useTheme();
  const [isThreeLoaded, setIsThreeLoaded] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Theme-aware colors
  const isDark = theme === "dark";
  const particleColor = isDark ? 0xffffff : 0x1e293b;
  const wireframeColor = isDark ? 0xffffff : 0x334155;
  const ringColor = isDark ? 0xffffff : 0x475569;

  // Load Three.js dynamically
  useEffect(() => {
    import("three")
      .then((module) => {
        THREE = module;
        setIsThreeLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to load Three.js:", error);
      });
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!isThreeLoaded || !THREE || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ThreeJS = THREE;
    let mounted = true;

    const checkAndInit = () => {
      if (!mounted) return;

      const parent = canvas.parentElement;
      if (!parent) {
        requestAnimationFrame(checkAndInit);
        return;
      }

      const rect = parent.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        requestAnimationFrame(checkAndInit);
        return;
      }

      // Initialize scene
      const scene = new ThreeJS.Scene();
      const camera = new ThreeJS.PerspectiveCamera(
        50,
        rect.width / rect.height,
        0.1,
        1000
      );
      camera.position.z = 5;

      const renderer = new ThreeJS.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Create main crystal geometry (Icosahedron for gem-like appearance)
      const crystalGeometry = new ThreeJS.IcosahedronGeometry(1.5, 1);
      
      // Create glass-like material with rainbow effect
      const crystalMaterial = new ThreeJS.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.95,
        thickness: 1.5,
        ior: 2.4, // Diamond-like refraction
        transparent: true,
        opacity: 0.9,
        envMapIntensity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      });

      const crystal = new ThreeJS.Mesh(crystalGeometry, crystalMaterial);
      scene.add(crystal);

      // Wireframe overlay for extra detail
      const wireframeMaterial = new ThreeJS.MeshBasicMaterial({
        color: wireframeColor,
        wireframe: true,
        transparent: true,
        opacity: isDark ? 0.15 : 0.4,
      });
      const wireframe = new ThreeJS.Mesh(crystalGeometry.clone(), wireframeMaterial);
      wireframe.scale.setScalar(1.02);
      scene.add(wireframe);

      // Inner glow sphere
      const glowGeometry = new ThreeJS.IcosahedronGeometry(0.8, 2);
      const glowMaterial = new ThreeJS.MeshBasicMaterial({
        color: 0x8888ff,
        transparent: true,
        opacity: 0.3,
      });
      const innerGlow = new ThreeJS.Mesh(glowGeometry, glowMaterial);
      scene.add(innerGlow);

      // Outer ring for rainbow dispersion effect
      const ringGeometry = new ThreeJS.TorusGeometry(2.2, 0.02, 16, 100);
      const ringMaterial = new ThreeJS.MeshBasicMaterial({
        color: ringColor,
        transparent: true,
        opacity: isDark ? 0.2 : 0.5,
      });
      const ring = new ThreeJS.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);

      // Second ring
      const ring2 = new ThreeJS.Mesh(ringGeometry.clone(), ringMaterial.clone());
      ring2.rotation.x = Math.PI / 3;
      ring2.rotation.y = Math.PI / 6;
      scene.add(ring2);

      // Lighting for refraction effect
      const ambientLight = new ThreeJS.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight1 = new ThreeJS.PointLight(0xff6b6b, 1, 10);
      pointLight1.position.set(3, 2, 2);
      scene.add(pointLight1);

      const pointLight2 = new ThreeJS.PointLight(0x6b6bff, 1, 10);
      pointLight2.position.set(-3, -2, 2);
      scene.add(pointLight2);

      const pointLight3 = new ThreeJS.PointLight(0x6bffb8, 1, 10);
      pointLight3.position.set(0, 3, -2);
      scene.add(pointLight3);

      // Particles around the crystal
      const particleCount = deviceInfo.isMobile ? 100 : 300;
      const particlesGeometry = new ThreeJS.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 2;
        const height = (Math.random() - 0.5) * 3;
        positions[i] = Math.cos(angle) * radius;
        positions[i + 1] = height;
        positions[i + 2] = Math.sin(angle) * radius;
      }

      particlesGeometry.setAttribute(
        "position",
        new ThreeJS.BufferAttribute(positions, 3)
      );

      const particlesMaterial = new ThreeJS.PointsMaterial({
        color: particleColor,
        size: isDark ? 0.02 : 0.03,
        transparent: true,
        opacity: isDark ? 0.5 : 0.7,
      });

      const particles = new ThreeJS.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // Mouse tracking
      const mouse = { x: 0, y: 0 };
      const targetRotation = { x: 0, y: 0 };

      const handleMouseMove = (event: MouseEvent) => {
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      };

      window.addEventListener("mousemove", handleMouseMove);

      // Animation loop
      let animationId: number;
      let time = 0;

      const animate = () => {
        if (!mounted) return;
        animationId = requestAnimationFrame(animate);
        time += 0.016;

        // Smooth mouse following
        targetRotation.x += (mouse.y * 0.5 - targetRotation.x) * 0.05;
        targetRotation.y += (mouse.x * 0.5 - targetRotation.y) * 0.05;

        // Rotate crystal based on mouse
        crystal.rotation.x = targetRotation.x * 0.5 + time * 0.1;
        crystal.rotation.y = targetRotation.y * 0.5 + time * 0.15;
        
        wireframe.rotation.copy(crystal.rotation);
        innerGlow.rotation.x = -time * 0.2;
        innerGlow.rotation.y = time * 0.15;

        // Animate rings
        ring.rotation.z = time * 0.1;
        ring2.rotation.z = -time * 0.08;

        // Pulsing inner glow
        const pulse = Math.sin(time * 2) * 0.1 + 1;
        innerGlow.scale.setScalar(0.8 * pulse);

        // Animate particles orbiting
        particles.rotation.y += 0.002;
        particles.rotation.x = Math.sin(time * 0.5) * 0.1;

        // Animate lights for rainbow effect
        pointLight1.position.x = Math.sin(time) * 3;
        pointLight1.position.z = Math.cos(time) * 3;
        pointLight2.position.x = Math.sin(time + 2) * 3;
        pointLight2.position.z = Math.cos(time + 2) * 3;
        pointLight3.position.y = Math.sin(time * 0.5) * 3;

        renderer.render(scene, camera);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(rect.width, rect.height);
      };

      window.addEventListener("resize", handleResize);

      // Cleanup function
      cleanupRef.current = () => {
        mounted = false;
        cancelAnimationFrame(animationId);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);

        renderer.dispose();
        crystalGeometry.dispose();
        crystalMaterial.dispose();
        wireframeMaterial.dispose();
        glowGeometry.dispose();
        glowMaterial.dispose();
        ringGeometry.dispose();
        ringMaterial.dispose();
        particlesGeometry.dispose();
        particlesMaterial.dispose();
      };
    };

    checkAndInit();

    return () => {
      mounted = false;
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [isThreeLoaded, deviceInfo.isMobile]);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-void-black"
    >
      {/* 3D Canvas */}
      <div className="relative" style={{ minHeight: "400px" }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-0"
        />

        {/* Content Overlay */}
        <div className="relative z-10 text-center px-6 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Label */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-off-white/30" />
              <span className="text-off-white/40 text-xs tracking-[0.3em] uppercase">
                My Philosophy
              </span>
              <div className="w-12 h-px bg-off-white/30" />
            </div>

            {/* Title */}
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-off-white tracking-tight leading-tight font-bold mb-4">
              Vision to
              <br />
              <span className="text-off-white/60">Reality</span>
            </h2>

            {/* Subtitle */}
            <p className="text-off-white/50 text-sm sm:text-base max-w-xl mx-auto mb-6">
              Every project starts with an idea. I bring them to life through
              technology, teamwork, and a passion for innovation.
            </p>

            {/* Decorative line */}
            <motion.div
              className="mx-auto w-24 h-px bg-gradient-to-r from-transparent via-off-white/40 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient for blending */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void-black to-transparent pointer-events-none z-20" />
    </section>
  );
}
