"use client";

import * as React from "react";

/**
 * An indefinitely scrolling candlestick price chart rendered on a plain
 * 2D canvas — green bodies for up candles, red for down, thin wicks
 * extending to the high/low. New candles are generated via a random walk
 * as older ones scroll off the left edge, so the chart never repeats and
 * never "ends". Pure canvas, no charting library needed.
 */
export function CandlestickBackground() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const UP_COLOR = "rgba(52, 211, 153, 0.55)";
    const DOWN_COLOR = "rgba(248, 113, 113, 0.55)";
    const UP_WICK = "rgba(52, 211, 153, 0.75)";
    const DOWN_WICK = "rgba(248, 113, 113, 0.75)";

    const CANDLE_WIDTH = 10;
    const CANDLE_GAP = 6;
    const SCROLL_SPEED = 0.35; // px per frame

    interface Candle {
      open: number;
      close: number;
      high: number;
      low: number;
    }

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let midline = 0;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      midline = height * 0.55;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Random-walk price generator, seeded near the vertical middle so the
    // chart has room to wander both up and down indefinitely
    let lastClose = midline;
    const volatility = () => height * 0.03;

    const makeCandle = (): Candle => {
      const open = lastClose;
      const drift = (Math.random() - 0.5) * volatility() * 2;
      let close = open + drift;

      // Gently pull the walk back toward the middle band so it never
      // wanders permanently off-screen
      const pull = (midline - close) * 0.02;
      close += pull;

      const wickUp = Math.random() * volatility() * 0.8;
      const wickDown = Math.random() * volatility() * 0.8;
      const high = Math.max(open, close) + wickUp;
      const low = Math.min(open, close) - wickDown;

      lastClose = close;
      return { open, close, high, low };
    };

    const step = CANDLE_WIDTH + CANDLE_GAP;
    let candles: Candle[] = [];
    let scrollOffset = 0;

    const seedCandles = () => {
      candles = [];
      lastClose = midline;
      const count = Math.ceil(width / step) + 4;
      for (let i = 0; i < count; i++) candles.push(makeCandle());
    };
    seedCandles();

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      candles.forEach((candle, i) => {
        const x = i * step - scrollOffset;
        if (x < -step || x > width + step) return;

        const isUp = candle.close >= candle.open;
        ctx.strokeStyle = isUp ? UP_WICK : DOWN_WICK;
        ctx.fillStyle = isUp ? UP_COLOR : DOWN_COLOR;
        ctx.lineWidth = 1;

        // Wick
        ctx.beginPath();
        ctx.moveTo(x + CANDLE_WIDTH / 2, candle.high);
        ctx.lineTo(x + CANDLE_WIDTH / 2, candle.low);
        ctx.stroke();

        // Body
        const bodyTop = Math.min(candle.open, candle.close);
        const bodyHeight = Math.max(Math.abs(candle.close - candle.open), 1.5);
        ctx.fillRect(x, bodyTop, CANDLE_WIDTH, bodyHeight);
      });
    };

    let animationFrame: number;
    const tick = () => {
      scrollOffset += SCROLL_SPEED;

      // Once a full candle's width has scrolled past, drop it and append
      // a freshly generated one at the end — the chart is infinite
      if (scrollOffset >= step) {
        scrollOffset -= step;
        candles.shift();
        candles.push(makeCandle());
      }

      drawFrame();

      if (!prefersReducedMotion) {
        animationFrame = requestAnimationFrame(tick);
      }
    };
    tick();

    const handleResize = () => {
      resize();
      seedCandles();
      scrollOffset = 0;
      drawFrame();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60 dark:opacity-70"
      aria-hidden
    />
  );
}
