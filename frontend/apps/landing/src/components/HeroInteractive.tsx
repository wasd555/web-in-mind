"use client";

import { useEffect, useRef } from "react";

type Orb = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  hue: number;
};

function createOrbs(count: number, w: number, h: number, rnd = Math.random): Orb[] {
  const orbs: Orb[] = [];
  for (let i = 0; i < count; i += 1) {
    const r = 80 + rnd() * 140;
    orbs.push({
      x: rnd() * w,
      y: rnd() * h,
      r,
      vx: (rnd() - 0.5) * 0.3,
      vy: (rnd() - 0.5) * 0.3,
      hue: 160 + rnd() * 80, // teal to sky
    });
  }
  return orbs;
}

export default function HeroInteractive() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, has: false });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let w = 0;
    let h = 0;
    let raf = 0;
    let orbs: Orb[] = [];
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      orbs = createOrbs(6, w, h);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      // soft background
      const grd = ctx.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "rgba(236, 253, 245, .6)");
      grd.addColorStop(1, "rgba(224, 242, 254, .6)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      const { x: px, y: py, has } = pointerRef.current;
      const parallaxX = has ? (px - w / 2) * 0.02 : 0;
      const parallaxY = has ? (py - h / 2) * 0.02 : 0;

      for (const o of orbs) {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r) o.x = w + o.r;
        if (o.x > w + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = h + o.r;
        if (o.y > h + o.r) o.y = -o.r;

        const g = ctx.createRadialGradient(o.x + parallaxX, o.y + parallaxY, o.r * 0.1, o.x + parallaxX, o.y + parallaxY, o.r);
        g.addColorStop(0, `hsla(${o.hue}, 80%, 70%, .65)`);
        g.addColorStop(1, `hsla(${o.hue + 10}, 90%, 90%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(o.x + parallaxX, o.y + parallaxY, o.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // subtle grain
      ctx.globalAlpha = 0.05;
      for (let i = 0; i < 2; i++) {
        const y = (t * 0.02 + i * 40) % 80;
        const grad = ctx.createLinearGradient(0, y, w, y + 1);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.5, "rgba(255,255,255,1)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, y, w, 1);
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, has: true };
    };
    const onLeave = () => { pointerRef.current.has = false; };

    const onResize = () => { resize(); };
    resize();
    raf = requestAnimationFrame(draw);
    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerdown", onPointer);
    canvas.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}


