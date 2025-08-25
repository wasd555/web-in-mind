"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroThree() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const dpr = Math.min(1.6, window.devicePixelRatio || 1);
    renderer.setPixelRatio(dpr);
    renderer.setClearAlpha(0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 7;

    // Gradient ambient light to lift tones subtly
    const light = new THREE.HemisphereLight(0x7dd3fc, 0x86efac, 0.45);
    scene.add(light);

    const particleCount = 10;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colorA = new THREE.Color("#60a5fa"); // sky
    const colorB = new THREE.Color("#34d399"); // emerald

    for (let i = 0; i < particleCount; i++) {
      // distribute roughly on sphere shell with slight depth
      const r = 3.4 + Math.random() * 1.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const t = (y + 4.4) / 8.8; // vertical gradient
      const c = colorA.clone().lerp(colorB, THREE.MathUtils.clamp(t, 0, 1));
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      const rs = Math.random();
      sizes[i] = 1 + Math.pow(rs, 6) * 14; // 1..15
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    // use custom attribute name to avoid clashing with built-in semantics in some platforms
    geometry.setAttribute("instanceColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("sizeMul", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_scale: { value: 1 },
        u_mouse: { value: new THREE.Vector2(0, 0) },
        u_scroll: { value: 0 },
        u_colorA: { value: new THREE.Color("#60a5fa") },
        u_colorB: { value: new THREE.Color("#34d399") },
      },
      vertexShader: `
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform float u_scroll;
        varying vec3 vColor;
        varying float vSeed;
        attribute vec3 instanceColor;
        attribute float sizeMul;
        void main(){
          vColor = instanceColor;
          // pseudo-random seed from position for twinkle
          vSeed = fract(sin(dot(position.xyz, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
          vec3 p = position;
          // subtle breathing motion
          float d = length(p);
          p *= 1.0 + 0.05 * sin(u_time * 0.6 + d);
          // mouse parallax swirl (rotate around Y and X)
          float angY = radians(u_mouse.x * 6.0);
          float cy = cos(angY), sy = sin(angY);
          p.xz = mat2(cy, -sy, sy, cy) * p.xz;
          float angX = radians(u_mouse.y * -6.0);
          float cx = cos(angX), sx = sin(angX);
          p.yz = mat2(cx, -sx, sx, cx) * p.yz;
          // slight vertical drift based on scroll progress
          p.y += (u_scroll - 0.5) * 0.8;

          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          float ps = (220.0 / -mvPosition.z);
          gl_PointSize = clamp(ps * sizeMul, 2.0, 80.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float u_scroll;
        uniform vec3 u_colorA;
        uniform vec3 u_colorB;
        varying float vSeed;
        void main(){
          vec2 uv = gl_PointCoord - 0.5;
          float r2 = dot(uv, uv);
          // compact core
          float core = exp(-8.0 * r2);
          // thin spikes
          float cross = exp(-50.0 * abs(uv.x)) + exp(-50.0 * abs(uv.y));
          float star = clamp(core + 0.30 * cross, 0.0, 1.0);
          // twinkle
          float tw = 0.70 + 0.30 * sin(6.283 * vSeed + u_scroll * 3.0);
          float mask = star * tw;
          // gradient through violet -> blue -> green hues
          vec3 purple = vec3(0.55, 0.40, 0.95);
          vec3 blue   = vec3(0.25, 0.55, 0.98);
          vec3 green  = vec3(0.35, 0.90, 0.70);
          float h = fract(vSeed + u_scroll * 0.6);
          vec3 hue1 = mix(purple, blue, smoothstep(0.0, 0.5, h));
          vec3 hue2 = mix(blue,   green, smoothstep(0.5, 1.0, h));
          vec3 hue  = mix(hue1, hue2, 0.5);
          // bright white core at very center, colored elsewhere
          float core2 = exp(-40.0 * r2);
          vec3 col = mix(hue, vec3(1.0), core2 * 0.4);
          gl_FragColor = vec4(col * (0.95*mask), 0.7*mask);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let mx = 0, my = 0;
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mx = (e.clientX - cx) / (rect.width / 2);
      my = (e.clientY - cy) / (rect.height / 2);
      mx = THREE.MathUtils.clamp(mx, -1, 1);
      my = THREE.MathUtils.clamp(my, -1, 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Scroll-driven uniforms
    const scroller = document.getElementById("app-scroll");
    let scrollProgress = 0; // 0..1 over whole page
    let sectionUnits = 0; // 0 at hero, ~1 at benefits, ~2 at pricing, ~3 at cta
    const onScroll = () => {
      if (!scroller) return;
      const max = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
      scrollProgress = scroller.scrollTop / max; // 0..1
      sectionUnits = scroller.scrollTop / Math.max(1, scroller.clientHeight);
    };
    scroller?.addEventListener("scroll", onScroll, { passive: true });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const animate = () => {
      t += 0.016;
      material.uniforms.u_time.value = t;
      // smooth mouse
      material.uniforms.u_mouse.value.lerp(new THREE.Vector2(mx, my), 0.12);
      material.uniforms.u_scroll.value += (scrollProgress - material.uniforms.u_scroll.value) * 0.08;
      // base rotation slower; speed up on active mouse movement
      // base rotation: nearly zero on hero, ramps up smoothly after ~0.6 viewport scroll
      const sectionT = THREE.MathUtils.smoothstep(sectionUnits, 0.6, 2.2); // 0..1
      const base = 0.000003 + 0.00028 * Math.pow(sectionT, 1.7);
      const mouseSpeed = Math.hypot(material.uniforms.u_mouse.value.x - mx, material.uniforms.u_mouse.value.y - my);
      const boost = THREE.MathUtils.clamp(mouseSpeed * 0.02, 0, 0.01);
      points.rotation.y += base + boost;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove as any);
      scroller?.removeEventListener("scroll", onScroll as any);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" aria-hidden />;
}


