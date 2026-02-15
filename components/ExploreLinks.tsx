"use client";

import { useRef, useLayoutEffect, useEffect, useState, useCallback } from "react";
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

      {/* Content Overlay — Redesigned */}
      <div ref={titleRef} className="relative z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Editorial Heading */}
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="text-off-white/40 text-xs sm:text-sm tracking-[0.3em] uppercase font-light mb-4 sm:mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Beyond the Code
            </motion.p>

            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-off-white tracking-tight leading-[1.1] font-bold">
              Let&apos;s Build
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #a78bfa, #60a5fa, #34d399, #a78bfa)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 4s linear infinite",
                }}
              >
                Something Extraordinary
              </span>
            </h2>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-center text-off-white/50 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Where code meets creativity — exploring the intersection of technology and design.
            {!deviceInfo.isLowEnd && (
              <span className="text-off-white/25 text-xs mt-2 block">
                Move your mouse to interact with the scene
              </span>
            )}
          </motion.p>

          {/* Decorative divider */}
          <motion.div
            className="mt-10 sm:mt-14 mx-auto w-48 h-px bg-gradient-to-r from-transparent via-off-white/20 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
          />

          {/* Inline Stats Strip */}
          <motion.div
            className="mt-10 sm:mt-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="max-w-3xl mx-auto backdrop-blur-sm bg-off-white/[0.04] border border-off-white/[0.08] rounded-2xl px-4 sm:px-8 py-5 sm:py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 md:gap-y-0 md:divide-x md:divide-off-white/10">
                <StatItem value={5} suffix="+" label="Years Experience" />
                <StatItem value={15} suffix="+" label="Projects Done" />
                <StatItem value={12} suffix="+" label="Tech Mastered" />
                <StatItem value={0} suffix="∞" label="Cups of Coffee" />
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="mt-10 sm:mt-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <a
              href="/work"
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-off-white/20 text-off-white/80 text-sm sm:text-base font-light tracking-wider uppercase transition-all duration-300 hover:border-off-white/40 hover:text-off-white hover:bg-off-white/[0.06] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
            >
              Explore My Work
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Counter animation stat item
function StatItem({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasAnimated || value === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 1500;
          const startTime = performance.now();

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * value);
            setCount(current);
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center py-1 md:py-0">
      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-off-white font-display tracking-tight">
        {value === 0 ? suffix : `${count}${suffix}`}
      </span>
      <span className="text-[10px] sm:text-xs text-off-white/40 uppercase tracking-[0.15em] mt-1">
        {label}
      </span>
    </div>
  );
}
