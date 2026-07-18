"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CalendarRange,
  LineChart,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CandlestickBackground } from "@/components/candlestick-background";

const FEATURES = [
  {
    icon: LineChart,
    title: "Trend-aware forecasting",
    description:
      "Linear regression blended with recency-weighted momentum — not a flat average.",
  },
  {
    icon: CalendarRange,
    title: "3, 6, or 12 months ahead",
    description: "Pick how far out you want to see, right from the input form.",
  },
  {
    icon: BrainCircuit,
    title: "Reasoning shown, not hidden",
    description: "Every forecast comes with a plain-English explanation of the method used.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Continuously scrolling candlestick chart, layered under the mesh gradient + grid texture */}
      <CandlestickBackground />

      {/* Ambient background: same mesh gradient + grid used across the app */}
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div
        className="absolute inset-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
        aria-hidden
      />

      <div className="container relative flex min-h-screen flex-col">
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-glow to-sky-glow shadow-glow">
              <Sparkles className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Ledgerline</span>
          </div>
          <ThemeToggle />
        </nav>

        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-glow opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-glow" />
            </span>
            Financial forecasting, made simple
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Azizbek&apos;s <span className="text-gradient">project</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base"
          >
            Enter three months of profit or expense figures and get an intelligent
            forecast for the months ahead — 3, 6, or 12 at a time — with the
            reasoning behind every number.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <Link href="/forecast">
              <Button size="lg" className="gap-2 px-7 text-base">
                Start forecasting
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 grid w-full max-w-3xl gap-4 sm:grid-cols-3"
          >
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="glass-panel rounded-2xl p-5 text-left transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-glow/20 to-sky-glow/20">
                  <feature.icon className="h-[18px] w-[18px] text-sky-glow" />
                </div>
                <p className="text-sm font-semibold">{feature.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <footer className="pb-8 text-center text-xs text-muted-foreground">
          Forecasts are estimates, not financial advice.
        </footer>
      </div>
    </main>
  );
}
