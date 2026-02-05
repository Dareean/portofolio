"use client";

import { useRef, useLayoutEffect, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { useDeviceType } from "@/lib/hooks";

export default function ExploreLinks() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    geometries: THREE.Mesh[];
    particles: THREE.Points;
    mouse: { x: number; y: number };
    targetRotation: { x: number; y: number };
  } | null>(null);
  const deviceInfo = useDeviceType();
  const [isVisible, setIsVisible] = useState(false);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current || deviceInfo.isLowEnd) return;

    const canvas = canvasRef.current;

    // Set initial canvas size
    const updateCanvasSize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateCanvasSize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.width / canvas.height,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !deviceInfo.isMobile,
    });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(
      deviceInfo.isMobile ? 1 : Math.min(window.devicePixelRatio, 2),
    );

    // Create geometric shapes
    const geometries: THREE.Mesh[] = [];

    // Torus
    const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
    const torusMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-2, 1, 0);
    scene.add(torus);
    geometries.push(torus);

    // Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(1, 0);
    const icoMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(2, -1, 0);
    scene.add(icosahedron);
    geometries.push(icosahedron);

    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(1, 0);
    const octaMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
    octahedron.position.set(0, -1.5, -2);
    scene.add(octahedron);
    geometries.push(octahedron);

    // Particles
    const particleCount = deviceInfo.isMobile ? 500 : 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Mouse tracking
    const mouse = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };

    const handleMouseMove = (event: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Store scene data
    sceneRef.current = {
      scene,
      camera,
      renderer,
      geometries,
      particles,
      mouse,
      targetRotation,
    };

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!sceneRef.current) return;

      const { geometries, particles, mouse, targetRotation } = sceneRef.current;

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
    setIsVisible(true);

    // Handle resize
    const handleResize = () => {
      if (!canvas || !sceneRef.current) return;
      const { camera, renderer } = sceneRef.current;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometries.forEach((geo) => {
        geo.geometry.dispose();
        if (Array.isArray(geo.material)) {
          geo.material.forEach((mat) => mat.dispose());
        } else {
          geo.material.dispose();
        }
      });
      particles.geometry.dispose();
      if (Array.isArray(particles.material)) {
        particles.material.forEach((mat) => mat.dispose());
      } else {
        particles.material.dispose();
      }
    };
  }, [deviceInfo.isLowEnd, deviceInfo.isMobile]);

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
      className="relative py-20 sm:py-32 md:py-40 lg:py-48 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden"
    >
      {/* 3D Canvas Background */}
      {!deviceInfo.isLowEnd && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full min-h-[600px]"
          style={{ opacity: isVisible ? 0.4 : 0, transition: "opacity 1s" }}
        />
      )}

      {/* Fallback gradient for low-end devices */}
      {deviceInfo.isLowEnd && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-off-white/[0.02] to-transparent pointer-events-none" />
      )}

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
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-off-white/[0.03] backdrop-blur-sm border border-off-white/10 rounded-2xl p-4 sm:p-6 hover:border-off-white/20 transition-all duration-300">
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </motion.div>
                  <motion.div
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-off-white mb-1 sm:mb-2 font-mono"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    5+
                  </motion.div>
                  <div className="text-xs sm:text-sm text-off-white/60">
                    Years Experience
                  </div>
                </div>
              </motion.div>

              {/* Stat 2 - Projects Completed */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-off-white/[0.03] backdrop-blur-sm border border-off-white/10 rounded-2xl p-4 sm:p-6 hover:border-off-white/20 transition-all duration-300">
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </motion.div>
                  <motion.div
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-off-white mb-1 sm:mb-2 font-mono"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    15+
                  </motion.div>
                  <div className="text-xs sm:text-sm text-off-white/60">
                    Projects Done
                  </div>
                </div>
              </motion.div>

              {/* Stat 3 - Technologies */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-off-white/[0.03] backdrop-blur-sm border border-off-white/10 rounded-2xl p-4 sm:p-6 hover:border-off-white/20 transition-all duration-300">
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </motion.div>
                  <motion.div
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-off-white mb-1 sm:mb-2 font-mono"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    12+
                  </motion.div>
                  <div className="text-xs sm:text-sm text-off-white/60">
                    Technologies
                  </div>
                </div>
              </motion.div>

              {/* Stat 4 - Coffee Consumed (Fun) */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-off-white/[0.03] backdrop-blur-sm border border-off-white/10 rounded-2xl p-4 sm:p-6 hover:border-off-white/20 transition-all duration-300">
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center"
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7h-1M8 7h1m0 0H8m9 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V7m9 0a2 2 0 00-2-2H9a2 2 0 00-2 2m13 0h-1m-9 7h2"
                      />
                    </svg>
                  </motion.div>
                  <motion.div
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-off-white mb-1 sm:mb-2 font-mono"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    ∞
                  </motion.div>
                  <div className="text-xs sm:text-sm text-off-white/60">
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
