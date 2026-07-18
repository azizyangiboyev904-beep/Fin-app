"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Cinematic splash / loading screen shown once when the app boots.
 *
 * Visual: a full animated scene — floating line charts, candlestick
 * charts, and bar charts drifting through pseudo-3D depth, plus glowing
 * particles and light streaks, rendered on a dark navy backdrop with a
 * soft blue/cyan glow. Above the scene, a sequence of system-status lines
 * types itself out one character at a time, pauses, fades, and moves to
 * the next line, ending on "Azizbek's Project" before the whole screen
 * fades into the app.
 */

const STATUS_MESSAGES = [
  "Initializing…",
  "Loading market data…",
  "Forecasting engine online…",
  "AI models ready…",
  "Azizbek's Project",
];

const TYPE_SPEED_MS = 42;
const HOLD_MS = 650;
const FINAL_HOLD_MS = 950;
const FADE_MS = 280;

const PALETTE = {
  bg0: "#05070d",
  bg1: "#070b16",
  navy: "#0a1226",
  cyan: "34,211,238",
  blue: "56,132,255",
  emerald: "52,211,153",
  red: "248,113,113",
};

type ChartKind = "line" | "candle" | "bar";

interface ChartPlane {
  kind: ChartKind;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  driftX: number;
  driftY: number;
  rotPhase: number;
  rotSpeed: number;
  seed: number;
  hue: "cyan" | "emerald" | "blue";
}

interface Particle {
  x: number;
  y: number;
  z: number;
  r: number;
  speed: number;
  twinklePhase: number;
  twinkleSpeed: number;
  hue: "cyan" | "emerald" | "blue";
}

interface Streak {
  x: number;
  y: number;
  len: number;
  angle: number;
  speed: number;
  life: number;
  maxLife: number;
  hue: "cyan" | "emerald";
}

function colorFor(hue: "cyan" | "emerald" | "blue") {
  if (hue === "cyan") return PALETTE.cyan;
  if (hue === "emerald") return PALETTE.emerald;
  return PALETTE.blue;
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ChartScene() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;
    const ctx = ctx2d;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const rand = mulberry32(1337);
    const isMobile = width < 640;

    const kinds: ChartKind[] = ["candle", "line", "candle", "bar", "candle"];
    const planeCount = isMobile ? 5 : 8;
    const planes: ChartPlane[] = Array.from({ length: planeCount }, (_, i) => {
      const z = 0.15 + rand() * 0.85;
      const kind = kinds[i % kinds.length];
      const isCandle = kind === "candle";
      return {
        kind,
        x: rand(),
        y: rand(),
        z,
        w: (isCandle ? (isMobile ? 200 : 320) : isMobile ? 140 : 220) + rand() * (isCandle ? 200 : 160),
        h: (isCandle ? (isMobile ? 110 : 170) : isMobile ? 70 : 100) + rand() * (isCandle ? 90 : 70),
        driftX: (rand() - 0.5) * (isCandle ? 0.00032 : 0.00006),
        driftY: (rand() - 0.5) * (isCandle ? 0.00022 : 0.00004),
        rotPhase: rand() * Math.PI * 2,
        rotSpeed: (isCandle ? 0.00028 : 0.00012) + rand() * (isCandle ? 0.00034 : 0.00018),
        seed: Math.floor(rand() * 100000),
        hue: (["cyan", "emerald", "blue"] as const)[Math.floor(rand() * 3)],
      };
    });

    const particleCount = isMobile ? 40 : 90;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: rand(),
      y: rand(),
      z: rand(),
      r: 0.6 + rand() * 1.8,
      speed: 0.02 + rand() * 0.05,
      twinklePhase: rand() * Math.PI * 2,
      twinkleSpeed: 0.0008 + rand() * 0.0016,
      hue: (["cyan", "emerald", "blue"] as const)[Math.floor(rand() * 3)],
    }));

    const streaks: Streak[] = [];
    const spawnStreak = () => {
      if (prefersReducedMotion) return;
      streaks.push({
        x: rand() * width,
        y: rand() * height * 0.6,
        len: 120 + rand() * 220,
        angle: (-20 + rand() * 10) * (Math.PI / 180),
        speed: 2.2 + rand() * 2.2,
        life: 0,
        maxLife: 70 + rand() * 40,
        hue: rand() > 0.5 ? "cyan" : "emerald",
      });
    };

    function drawLineChart(
      cx: number,
      cy: number,
      w: number,
      h: number,
      seed: number,
      alpha: number,
      hue: string,
      t: number
    ) {
      const r = mulberry32(seed);
      const points = 9;
      const pts: [number, number][] = [];
      let v = 0.5;
      for (let i = 0; i < points; i++) {
        v += (r() - 0.48) * 0.22;
        v = Math.max(0.08, Math.min(0.92, v));
        const px = cx - w / 2 + (w * i) / (points - 1);
        const py = cy + h / 2 - v * h + Math.sin(t * 0.0006 + i) * (h * 0.015);
        pts.push([px, py]);
      }

      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      ctx.shadowColor = `rgba(${hue}, ${0.9 * alpha})`;
      ctx.shadowBlur = 18;
      ctx.strokeStyle = `rgba(${hue}, ${0.85 * alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
      ctx.stroke();

      const grad = ctx.createLinearGradient(0, cy - h / 2, 0, cy + h / 2);
      grad.addColorStop(0, `rgba(${hue}, ${0.22 * alpha})`);
      grad.addColorStop(1, `rgba(${hue}, 0)`);
      ctx.shadowBlur = 0;
      ctx.beginPath();
      pts.forEach(([px, py], i) => (i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
      ctx.lineTo(pts[pts.length - 1][0], cy + h / 2);
      ctx.lineTo(pts[0][0], cy + h / 2);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      pts.forEach(([px, py], i) => {
        if (i % 2 !== 0) return;
        ctx.beginPath();
        ctx.shadowColor = `rgba(${hue}, ${alpha})`;
        ctx.shadowBlur = 12;
        ctx.fillStyle = `rgba(${hue}, ${alpha})`;
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    function drawCandleChart(
      cx: number,
      cy: number,
      w: number,
      h: number,
      seed: number,
      alpha: number,
      t: number
    ) {
      const r = mulberry32(seed + 7);
      const n = 7;
      const cw = w / n;
      let last = 0.5;
      ctx.save();
      for (let i = 0; i < n; i++) {
        const open = last;
        let close = open + (r() - 0.5) * 0.3;
        close = Math.max(0.05, Math.min(0.95, close));
        const high = Math.max(open, close) + r() * 0.1;
        const low = Math.min(open, close) - r() * 0.1;
        last = close;

        const up = close >= open;
        const color = up
          ? `rgba(${PALETTE.emerald}, ${alpha})`
          : `rgba(${PALETTE.red}, ${alpha})`;

        const px = cx - w / 2 + cw * i + cw / 2;
        const bob = Math.sin(t * 0.0013 + i * 0.6) * (h * 0.03);
        const yTop = cy + h / 2 - Math.max(open, close) * h + bob;
        const yBot = cy + h / 2 - Math.min(open, close) * h + bob;
        const yHigh = cy + h / 2 - high * h + bob;
        const yLow = cy + h / 2 - low * h + bob;

        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, yHigh);
        ctx.lineTo(px, yLow);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.shadowBlur = 12;
        const bodyW = cw * 0.72;
        const bodyH = Math.max(4, yBot - yTop);
        ctx.fillRect(px - bodyW / 2, yTop, bodyW, bodyH);
      }
      ctx.restore();
    }

    function drawBarChart(
      cx: number,
      cy: number,
      w: number,
      h: number,
      seed: number,
      alpha: number,
      hue: string,
      t: number
    ) {
      const r = mulberry32(seed + 3);
      const n = 7;
      const bw = w / n;
      ctx.save();
      for (let i = 0; i < n; i++) {
        const v = 0.25 + r() * 0.7;
        const bob = Math.sin(t * 0.0005 + i) * 0.02;
        const barH = (v + bob) * h;
        const px = cx - w / 2 + bw * i + bw * 0.15;
        const py = cy + h / 2 - barH;
        const grad = ctx.createLinearGradient(0, py, 0, cy + h / 2);
        grad.addColorStop(0, `rgba(${hue}, ${alpha})`);
        grad.addColorStop(1, `rgba(${hue}, ${alpha * 0.15})`);
        ctx.fillStyle = grad;
        ctx.shadowColor = `rgba(${hue}, ${alpha * 0.8})`;
        ctx.shadowBlur = 10;
        const bw2 = bw * 0.7;
        const rad = Math.min(4, bw2 / 2);
        ctx.beginPath();
        ctx.moveTo(px, py + rad);
        ctx.arcTo(px, py, px + rad, py, rad);
        ctx.lineTo(px + bw2 - rad, py);
        ctx.arcTo(px + bw2, py, px + bw2, py + rad, rad);
        ctx.lineTo(px + bw2, cy + h / 2);
        ctx.lineTo(px, cy + h / 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    let raf = 0;
    const start = performance.now();
    let lastStreak = 0;

    function frame(now: number) {
      const t = now - start;

      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.38,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      bgGrad.addColorStop(0, PALETTE.navy);
      bgGrad.addColorStop(0.55, PALETTE.bg1);
      bgGrad.addColorStop(1, PALETTE.bg0);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const sweepX = width * (0.5 + 0.5 * Math.sin(t * 0.00012));
      const sweep = ctx.createRadialGradient(
        sweepX,
        height * 0.3,
        0,
        sweepX,
        height * 0.3,
        width * 0.6
      );
      sweep.addColorStop(0, `rgba(${PALETTE.cyan}, 0.05)`);
      sweep.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sweep;
      ctx.fillRect(0, 0, width, height);

      const sortedParticles = [...particles].sort((a, b) => b.z - a.z);
      sortedParticles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.y -= p.speed * 0.02 * (1 - p.z * 0.5);
          if (p.y < -0.05) p.y = 1.05;
        }
        const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t * p.twinkleSpeed + p.twinklePhase));
        const scale = 1 - p.z * 0.6;
        const px = p.x * width;
        const py = p.y * height;
        const rr = p.r * scale * (isMobile ? 1.4 : 1.8);
        const hue = colorFor(p.hue);
        const alpha = twinkle * (0.55 - p.z * 0.25);
        ctx.save();
        ctx.shadowColor = `rgba(${hue}, ${alpha})`;
        ctx.shadowBlur = 8 * scale;
        ctx.fillStyle = `rgba(${hue}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.4, rr), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      const sortedPlanes = [...planes].sort((a, b) => b.z - a.z);
      sortedPlanes.forEach((pl) => {
        if (!prefersReducedMotion) {
          pl.x += pl.driftX;
          pl.y += pl.driftY;
          pl.rotPhase += pl.rotSpeed;
          if (pl.x < -0.15) pl.x = 1.15;
          if (pl.x > 1.15) pl.x = -0.15;
          if (pl.y < -0.15) pl.y = 1.15;
          if (pl.y > 1.15) pl.y = -0.15;
        }

        const depthScale = 1 - pl.z * 0.55;
        const alpha = (1 - pl.z * 0.7) * (isMobile ? 0.8 : 0.9);
        const skewX = Math.sin(pl.rotPhase) * 0.12;
        const tiltY = Math.cos(pl.rotPhase * 0.7) * 6 * depthScale;

        const cx = pl.x * width;
        const cy = pl.y * height + tiltY;
        const w = pl.w * depthScale;
        const h = pl.h * depthScale;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.transform(1, 0, skewX, 1, 0, 0);
        ctx.translate(-cx, -cy);

        if (pl.kind === "line") {
          drawLineChart(cx, cy, w, h, pl.seed, alpha, colorFor(pl.hue), t);
        } else if (pl.kind === "candle") {
          drawCandleChart(cx, cy, w, h, pl.seed, alpha, t);
        } else if (pl.kind === "bar") {
          drawBarChart(cx, cy, w, h, pl.seed, alpha, colorFor(pl.hue), t);
        }
        ctx.restore();
      });

      if (!prefersReducedMotion && t - lastStreak > 900 && streaks.length < 3) {
        spawnStreak();
        lastStreak = t;
      }
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.life += 1;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        const progress = s.life / s.maxLife;
        const alpha = Math.sin(progress * Math.PI) * 0.35;
        const hue = colorFor(s.hue);
        const x2 = s.x - Math.cos(s.angle) * s.len;
        const y2 = s.y - Math.sin(s.angle) * s.len;
        const grad = ctx.createLinearGradient(s.x, s.y, x2, y2);
        grad.addColorStop(0, `rgba(${hue}, ${alpha})`);
        grad.addColorStop(1, `rgba(${hue}, 0)`);
        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.shadowColor = `rgba(${hue}, ${alpha})`;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
        if (s.life >= s.maxLife) streaks.splice(i, 1);
      }

      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.2,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}

function TypingSequence({ onComplete }: { onComplete: () => void }) {
  const [messageIndex, setMessageIndex] = React.useState(0);
  const [charCount, setCharCount] = React.useState(0);
  const [fading, setFading] = React.useState(false);
  const [showCursor, setShowCursor] = React.useState(true);
  const [revealed, setRevealed] = React.useState(false);

  const isLast = messageIndex === STATUS_MESSAGES.length - 1;
  const message = STATUS_MESSAGES[messageIndex];
  const fullyTyped = charCount >= message.length;

  React.useEffect(() => {
    const blink = window.setInterval(() => setShowCursor((c) => !c), 500);
    return () => window.clearInterval(blink);
  }, []);

  React.useEffect(() => {
    if (fullyTyped) return;
    const t = window.setTimeout(() => setCharCount((c) => c + 1), TYPE_SPEED_MS);
    return () => window.clearTimeout(t);
  }, [charCount, fullyTyped]);

  React.useEffect(() => {
    if (!fullyTyped) return;

    if (isLast) {
      // Brief pause with the cursor still blinking, then cross-fade into
      // the large gradient title rather than snapping styles instantly.
      const revealTimer = window.setTimeout(() => setRevealed(true), 300);
      const doneTimer = window.setTimeout(onComplete, FINAL_HOLD_MS);
      return () => {
        window.clearTimeout(revealTimer);
        window.clearTimeout(doneTimer);
      };
    }

    const holdTimer = window.setTimeout(() => setFading(true), HOLD_MS);
    return () => window.clearTimeout(holdTimer);
  }, [fullyTyped, isLast, onComplete]);

  React.useEffect(() => {
    if (!fading) return;
    const t = window.setTimeout(() => {
      setFading(false);
      setCharCount(0);
      setMessageIndex((i) => i + 1);
    }, FADE_MS);
    return () => window.clearTimeout(t);
  }, [fading]);

  return (
    <div className="flex min-h-[1.5em] items-center justify-center">
      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.p
            key="final-title"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #b7f3ff 35%, #34d399 70%, #38bdf8 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: "0 0 60px rgba(56,189,248,0.25)",
            }}
          >
            {message}
          </motion.p>
        ) : (
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: fading ? 0 : 1 }}
            transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
            className="font-mono text-sm tracking-wide text-cyan-200/80 sm:text-base"
          >
            {message.slice(0, charCount)}
            <span
              aria-hidden
              className="text-cyan-300/80"
              style={{ opacity: showCursor ? 1 : 0 }}
            >
              _
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LoadingScreen({ onDone }: { onDone?: () => void }) {
  const [visible, setVisible] = React.useState(true);
  const [exiting, setExiting] = React.useState(false);

  const handleSequenceComplete = React.useCallback(() => {
    setExiting(true);
  }, []);

  const handleExitComplete = React.useCallback(() => {
    setVisible(false);
    onDone?.();
  }, [onDone]);

  if (!visible) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!exiting && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#05070d]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: "blur(6px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChartScene />

          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <TypingSequence onComplete={handleSequenceComplete} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
