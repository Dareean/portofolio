"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LiquidChrome() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    clock?: THREE.Clock;
    mesh?: THREE.Mesh;
    animationId?: number;
  }>({});

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);

    const clock = new THREE.Clock();

    // Custom Shader Material for Liquid Metal Effect
    const liquidMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Noise functions for organic movement
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        // Fractal Brownian Motion for organic texture
        float fbm(vec3 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          
          for(int i = 0; i < 5; i++) {
            value += amplitude * snoise(p * frequency);
            frequency *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        void main() {
          vec2 uv = vUv;
          vec2 center = vec2(0.5, 0.5);
          
          // Create liquid flow effect
          float time = uTime * 0.15;
          
          // Multiple layers of noise for depth
          vec3 noiseInput1 = vec3(uv * 2.0, time);
          vec3 noiseInput2 = vec3(uv * 1.5 + vec2(uMouse.x, uMouse.y) * 0.3, time * 0.8);
          vec3 noiseInput3 = vec3(uv * 3.0, time * 0.5);
          
          float noise1 = fbm(noiseInput1);
          float noise2 = fbm(noiseInput2);
          float noise3 = fbm(noiseInput3);
          
          // Combine noise layers for liquid metal effect
          float liquidPattern = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
          
          // Add flowing distortion
          vec2 distortedUV = uv + vec2(
            sin(uv.y * 10.0 + time) * noise1 * 0.05,
            cos(uv.x * 10.0 + time) * noise2 * 0.05
          );
          
          // Create metallic blobs
          float dist = length(distortedUV - center);
          float blob1 = smoothstep(0.5, 0.0, dist + liquidPattern * 0.3);
          
          // Additional blobs for more complex liquid shapes
          vec2 blob2Pos = center + vec2(sin(time * 0.7) * 0.3, cos(time * 0.5) * 0.2);
          float blob2 = smoothstep(0.4, 0.0, length(distortedUV - blob2Pos) + noise2 * 0.2);
          
          vec2 blob3Pos = center + vec2(cos(time * 0.9) * 0.25, sin(time * 0.6) * 0.3);
          float blob3 = smoothstep(0.35, 0.0, length(distortedUV - blob3Pos) + noise3 * 0.15);
          
          // Combine all blobs
          float combinedBlobs = max(blob1, max(blob2, blob3));
          
          // Create chrome/metallic look
          float metallic = combinedBlobs;
          
          // Add highlights and reflections
          float highlight = pow(liquidPattern + 0.5, 3.0) * metallic;
          float reflection = smoothstep(0.3, 0.7, liquidPattern) * metallic * 0.5;
          
          // Silver/mercury color palette
          vec3 darkMetal = vec3(0.15, 0.15, 0.17);    // Dark metallic
          vec3 silverMetal = vec3(0.75, 0.75, 0.78);   // Silver
          vec3 brightMetal = vec3(0.95, 0.95, 0.98);   // Bright chrome
          
          // Mix colors based on metallic value
          vec3 metalColor = mix(darkMetal, silverMetal, metallic);
          metalColor = mix(metalColor, brightMetal, highlight);
          
          // Add slight color tint for more interest
          metalColor += vec3(0.05, 0.08, 0.15) * reflection;
          
          // Edge glow effect
          float edge = smoothstep(0.0, 0.1, metallic) - smoothstep(0.1, 0.3, metallic);
          metalColor += vec3(0.3, 0.4, 0.5) * edge;
          
          // Final color
          vec3 finalColor = metalColor * (0.5 + metallic);
          
          gl_FragColor = vec4(finalColor, metallic);
        }
      `,
      transparent: true,
    });

    // Create a plane to display the shader
    const geometry = new THREE.PlaneGeometry(10, 10, 32, 32);
    const mesh = new THREE.Mesh(geometry, liquidMaterial);
    scene.add(mesh);

    // Mouse interaction
    let mouseX = 0.5;
    let mouseY = 0.5;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX / window.innerWidth;
      mouseY = 1.0 - event.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      liquidMaterial.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      liquidMaterial.uniforms.uTime.value = elapsedTime;
      liquidMaterial.uniforms.uMouse.value.set(mouseX, mouseY);

      renderer.render(scene, camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    animate();

    // Store references
    sceneRef.current = { scene, camera, renderer, clock, mesh };

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }

      geometry.dispose();
      liquidMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
