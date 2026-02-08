"use client";

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDeviceType } from "@/lib/hooks";
import { useTheme } from "./ThemeProvider";

// Dynamic import Three.js only on client side
let THREE: typeof import("three") | null = null;

export default function ExploreLinks() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const deviceInfo = useDeviceType();
  const [isVisible, setIsVisible] = useState(true);
  const [isThreeLoaded, setIsThreeLoaded] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const { theme } = useTheme();

  // Theme-aware colors
  const isDark = theme === "dark";
  const particleColor = isDark ? 0xffffff : 0x1e293b;

  // Load Three.js dynamically
  useEffect(() => {
    // Force load Three.js - remove low-end check
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
    const ThreeJS = THREE; // Type assertion for TypeScript
    let mounted = true;

    // Wait for proper canvas dimensions
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
        75,
        rect.width / rect.height,
        0.1,
        1000,
      );
      camera.position.z = 5;

      const renderer = new ThreeJS.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !deviceInfo.isMobile,
      });
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Create geometric shapes
      const geometries: Array<InstanceType<typeof ThreeJS.Mesh>> = [];

      // Torus
      const torusGeometry = new ThreeJS.TorusGeometry(1, 0.4, 16, 100);
      const torusMaterial = new ThreeJS.MeshNormalMaterial({ wireframe: true });
      const torus = new ThreeJS.Mesh(torusGeometry, torusMaterial);
      torus.position.set(-2, 1, 0);
      scene.add(torus);
      geometries.push(torus);

      // Icosahedron
      const icoGeometry = new ThreeJS.IcosahedronGeometry(1, 0);
      const icoMaterial = new ThreeJS.MeshNormalMaterial({ wireframe: true });
      const icosahedron = new ThreeJS.Mesh(icoGeometry, icoMaterial);
      icosahedron.position.set(2, -1, 0);
      scene.add(icosahedron);
      geometries.push(icosahedron);

      // Octahedron
      const octaGeometry = new ThreeJS.OctahedronGeometry(1, 0);
      const octaMaterial = new ThreeJS.MeshNormalMaterial({ wireframe: true });
      const octahedron = new ThreeJS.Mesh(octaGeometry, octaMaterial);
      octahedron.position.set(0, -1.5, -2);
      scene.add(octahedron);
      geometries.push(octahedron);

      // Particles
      const particleCount = deviceInfo.isMobile ? 500 : 1000;
      const particlesGeometry = new ThreeJS.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
      }

      particlesGeometry.setAttribute(
        "position",
        new ThreeJS.BufferAttribute(positions, 3),
      );

      const particlesMaterial = new ThreeJS.PointsMaterial({
        color: particleColor,
        size: isDark ? 0.02 : 0.03,
        transparent: true,
        opacity: isDark ? 0.6 : 0.8,
      });

      const particles = new ThreeJS.Points(
        particlesGeometry,
        particlesMaterial,
      );
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
      const animate = () => {
        if (!mounted) return;
        animationId = requestAnimationFrame(animate);

        // Smooth mouse following
        targetRotation.x += (mouse.y * 0.5 - targetRotation.x) * 0.05;
        targetRotation.y += (mouse.x * 0.5 - targetRotation.y) * 0.05;

        // Rotate geometries
        geometries.forEach((geo, index) => {
          geo.rotation.x += 0.01 * (index + 1);
          geo.rotation.y += 0.005 * (index + 1);
          geo.rotation.x += targetRotation.x * 0.02;
          geo.rotation.y += targetRotation.y * 0.02;
        });

        // Rotate particles
        particles.rotation.y += 0.001;
        particles.rotation.y += targetRotation.y * 0.01;

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

        // Dispose Three.js resources
        renderer.dispose();
        geometries.forEach((geo) => {
          geo.geometry.dispose();
          if ("dispose" in geo.material) {
            (geo.material as any).dispose();
          }
        });
        particles.geometry.dispose();
        if ("dispose" in particles.material) {
          (particles.material as any).dispose();
        }
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

  // GSAP ScrollTrigger Animations
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 100, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-32 md:py-40 lg:py-48 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden bg-void-black"
    >
      {/* 3D Canvas Background - Always render */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full min-h-[600px] z-0"
        style={{ opacity: 0.5 }}
      />

      {/* Content Overlay */}
      <div ref={titleRef} className="relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Main Title */}
          <motion.h2
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-off-white tracking-tight leading-tight font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Explore the
            <br />
            <span className="bg-gradient-to-r from-off-white via-off-white/80 to-off-white bg-clip-text text-transparent">
              Possibilities
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-off-white/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Interactive experiences crafted with precision and creativity.
            <br />
            {!deviceInfo.isLowEnd && (
              <span className="text-off-white/40 text-xs mt-2 block">
                Move your mouse to interact with the scene
              </span>
            )}
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="mt-12 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-off-white/40 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
          />

          {/* Stats/Achievements Section */}
          <motion.div
            className="mt-16 sm:mt-20 md:mt-24"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
              {/* Stat 1 - Years of Experience */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full">
                  <motion.div
                    className="mb-4 text-off-white/80"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </motion.div>
                  <motion.div
                    className="text-4xl font-bold text-off-white mb-2 font-display tracking-tight"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    5+
                  </motion.div>
                  <div className="text-sm text-off-white/50 uppercase tracking-widest text-[10px]">
                    Years Experience
                  </div>
                </div>
              </motion.div>

              {/* Stat 2 - Projects Completed */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full">
                  <motion.div
                    className="mb-4 text-off-white/80"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                  <motion.div
                    className="text-4xl font-bold text-off-white mb-2 font-display tracking-tight"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    15+
                  </motion.div>
                  <div className="text-sm text-off-white/50 uppercase tracking-widest text-[10px]">
                    Projects Done
                  </div>
                </div>
              </motion.div>

              {/* Stat 3 - Technologies */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full">
                  <motion.div
                    className="mb-4 text-off-white/80"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  </motion.div>
                  <motion.div
                    className="text-4xl font-bold text-off-white mb-2 font-display tracking-tight"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    12+
                  </motion.div>
                  <div className="text-sm text-off-white/50 uppercase tracking-widest text-[10px]">
                    Machines Mastered
                  </div>
                </div>
              </motion.div>

              {/* Stat 4 - Coffee Consumed */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full">
                  <motion.div
                    className="mb-4 text-off-white/80"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                      <line x1="6" y1="1" x2="6" y2="4" />
                      <line x1="10" y1="1" x2="10" y2="4" />
                      <line x1="14" y1="1" x2="14" y2="4" />
                    </svg>
                  </motion.div>
                  <motion.div
                    className="text-4xl font-bold text-off-white mb-2 font-display tracking-tight"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    ∞
                  </motion.div>
                  <div className="text-sm text-off-white/50 uppercase tracking-widest text-[10px]">
                    Cups of Coffee
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
