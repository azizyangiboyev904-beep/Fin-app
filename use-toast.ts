"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export function Hero() {
  return (
    <header className="relative overflow-hidden border-b border-border/60">
      {/* Ambient background: mesh gradient + faint grid */}
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" aria-hidden />

      <div className="container relative">
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-glow to-sky-glow shadow-glow">
              <Sparkles className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Ledgerline</span>
          </div>
          <ThemeToggle />
        </nav>

        <div className="grid gap-12 pb-20 pt-10 md:grid-cols-2 md:items-center md:pb-28 md:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-glow opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-glow" />
              </span>
              Three months in, up to a year of foresight out
            </div>

            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Know what&apos;s
              <br />
              <span className="text-gradient">coming next</span>
              <br />
              before you live it.
            </h1>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Enter three months of profit or expense figures. Ledgerline fits a trend line
              across your data, blends in recent momentum, and projects 3, 6, or 12 months
              ahead — with the reasoning shown, not hidden.
            </p>

            <div className="mt-8 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ArrowUpRight className="h-4 w-4 text-emerald-glow" />
                Linear regression
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <ArrowUpRight className="h-4 w-4 text-sky-glow" />
                Momentum weighting
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative hidden md:block"
          >
            <TickerIllustration />
          </motion.div>
        </div>
      </div>
    </header>
  );
}

/**
 * Signature visual: an ambient animated ledger line — a stylized trend
 * path that draws itself in on load, with drifting mono-font readouts.
 * This is the one bold, memorable element; everything else stays quiet.
 */
function TickerIllustration() {
  return (
    <div className="glass-panel relative flex h-[340px] w-full items-center justify-center overflow-hidden p-8">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

      <svg viewBox="0 0 400 220" className="h-full w-full" fill="none">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.path
          d="M10,150 L70,150 L130,150"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="2"
          strokeDasharray="4 5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <motion.path
          d="M130,150 L200,110 L270,70 L390,20"
          stroke="url(#lineGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.6 }}
        />
        <motion.path
          d="M130,150 L200,110 L270,70 L390,20 L390,220 L130,220 Z"
          fill="url(#areaGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        />

        {[
          { cx: 10, cy: 150 },
          { cx: 70, cy: 150 },
          { cx: 130, cy: 150 },
        ].map((p, i) => (
          <circle key={`h-${i}`} cx={p.cx} cy={p.cy} r="4" fill="hsl(var(--muted-foreground))" />
        ))}
        {[
          { cx: 200, cy: 110 },
          { cx: 270, cy: 70 },
          { cx: 390, cy: 20 },
        ].map((p, i) => (
          <motion.circle
            key={`f-${i}`}
            cx={p.cx}
            cy={p.cy}
            r="5"
            fill="#38BDF8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.3 + i * 0.2 }}
          />
        ))}
      </svg>

      <motion.div
        className="num absolute right-8 top-8 rounded-lg bg-background/70 px-2.5 py-1 text-xs font-medium text-sky-glow shadow-glass-sm backdrop-blur"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.5 }}
      >
        +7.2% / mo
      </motion.div>
    </div>
  );
}
