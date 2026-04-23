"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  r: number;
  g: number;
  b: number;
  opacity: number;
  opacitySpeed: number;
  opacityDir: number;
}

interface Lightning {
  points: Array<{ x: number; y: number }>;
  life: number;
  maxLife: number;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let tick = 0;
    let particles: Particle[] = [];
    let lightnings: Lightning[] = [];
    let nextLightningTick = 120;

    const isMobile = () => window.innerWidth < 768;

    function newParticle(scatter = false): Particle {
      const isTeal = Math.random() > 0.38;
      return {
        x: Math.random() * width,
        y: scatter ? Math.random() * height : height + 10 + Math.random() * 50,
        vx: (Math.random() - 0.5) * 0.32,
        vy: -(0.22 + Math.random() * 0.55),
        size: 0.9 + Math.random() * 1.8,
        r: isTeal ? 13 : 16,
        g: isTeal ? 148 : 185,
        b: isTeal ? 136 : 129,
        opacity: 0.2 + Math.random() * 0.5,
        opacitySpeed: 0.002 + Math.random() * 0.004,
        opacityDir: Math.random() > 0.5 ? 1 : -1,
      };
    }

    function newLightning(): Lightning {
      const x = width * (0.12 + Math.random() * 0.76);
      const y = height * (0.06 + Math.random() * 0.42);
      const pts: Array<{ x: number; y: number }> = [{ x, y }];
      let cx = x;
      let cy = y;
      const segs = 4 + Math.floor(Math.random() * 4);
      for (let i = 0; i < segs; i++) {
        cx += (Math.random() - 0.5) * 26;
        cy += 7 + Math.random() * 13;
        pts.push({ x: cx, y: cy });
      }
      return { points: pts, life: 0, maxLife: 28 + Math.floor(Math.random() * 22) };
    }

    function resize() {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = isMobile() ? 26 : 60;
      particles = Array.from({ length: count }, () => newParticle(true));
    }

    function drawGrid() {
      const gs = 60;
      const top = height * 0.56;
      const span = height - top;

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(13,148,136,0.055)";

      for (let x = 0; x <= width + gs; x += gs) {
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = Math.ceil(top / gs) * gs; y <= height; y += gs) {
        const a = Math.max(0, ((y - top) / span) * 0.075);
        ctx.strokeStyle = `rgba(13,148,136,${a})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Fade mask — background colour fading into transparent
      const mask = ctx.createLinearGradient(0, top, 0, top + span * 0.55);
      mask.addColorStop(0, "rgba(10,15,26,1)");
      mask.addColorStop(1, "rgba(10,15,26,0)");
      ctx.fillStyle = mask;
      ctx.fillRect(0, top, width, span * 0.55);
    }

    function drawSun() {
      const cx = width / 2;
      const cy = height * 0.27;
      const pulse = 0.88 + 0.12 * Math.sin(tick * 0.013);
      const R = (isMobile() ? 105 : 185) * pulse;

      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      g1.addColorStop(0, `rgba(13,148,136,${0.11 * pulse})`);
      g1.addColorStop(0.45, `rgba(13,148,136,${0.048 * pulse})`);
      g1.addColorStop(1, "rgba(13,148,136,0)");
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.44);
      g2.addColorStop(0, `rgba(16,185,129,${0.20 * pulse})`);
      g2.addColorStop(0.55, `rgba(13,148,136,${0.09 * pulse})`);
      g2.addColorStop(1, "rgba(13,148,136,0)");
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.44, 0, Math.PI * 2);
      ctx.fill();

      const g3 = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.11);
      g3.addColorStop(0, `rgba(210,255,250,${0.45 * pulse})`);
      g3.addColorStop(0.5, `rgba(16,185,129,${0.28 * pulse})`);
      g3.addColorStop(1, "rgba(13,148,136,0)");
      ctx.fillStyle = g3;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.11, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawNetwork() {
      const linkDist = isMobile() ? 80 : 125;

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < linkDist) {
            const alpha = (1 - d / linkDist) * 0.13;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(13,148,136,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.2);
        grd.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${p.opacity})`);
        grd.addColorStop(0.38, `rgba(${p.r},${p.g},${p.b},${p.opacity * 0.35})`);
        grd.addColorStop(1, `rgba(${p.r},${p.g},${p.b},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawLightnings() {
      for (const l of lightnings) {
        const t = l.life / l.maxLife;
        const alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
        if (alpha <= 0.01) continue;

        ctx.save();
        ctx.shadowColor = "rgba(13,148,136,0.85)";
        ctx.shadowBlur = 12;
        ctx.strokeStyle = `rgba(185,255,246,${alpha * 0.82})`;
        ctx.lineWidth = 1.1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(l.points[0].x, l.points[0].y);
        for (let i = 1; i < l.points.length; i++) {
          ctx.lineTo(l.points[i].x, l.points[i].y);
        }
        ctx.stroke();
        ctx.restore();
      }
    }

    function update() {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.opacitySpeed * p.opacityDir;
        if (p.opacity > 0.72 || p.opacity < 0.14) p.opacityDir *= -1;
        if (p.y < -10) particles[i] = newParticle();
      }

      if (tick >= nextLightningTick) {
        lightnings.push(newLightning());
        nextLightningTick = tick + 90 + Math.floor(Math.random() * 150);
      }

      lightnings = lightnings.filter((l) => {
        l.life++;
        return l.life < l.maxLife;
      });

      tick++;
    }

    function frame() {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawSun();
      drawNetwork();
      drawLightnings();
      update();
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none", display: "block" }}
    />
  );
}
