"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { AnimatedCounter } from "@/components/animated-counter";
import { cn } from "@/lib/utils";
import type { CurrencyCode } from "@/lib/types";

interface StatCardProps {
  label: string;
  value: number;
  currency: CurrencyCode;
  icon: React.ReactNode;
  accent?: "emerald" | "sky" | "amber" | "rose";
  suffix?: string;
  asCurrency?: boolean;
  delay?: number;
}

const accentMap = {
  emerald: "from-emerald-glow/15 to-emerald-glow/0 text-emerald-glow",
  sky: "from-sky-glow/15 to-sky-glow/0 text-sky-glow",
  amber: "from-amber-glow/15 to-amber-glow/0 text-amber-glow",
  rose: "from-rose-glow/15 to-rose-glow/0 text-rose-glow",
};

export function StatCard({
  label,
  value,
  currency,
  icon,
  accent = "sky",
  suffix,
  asCurrency = true,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3 }}
      className="glass-panel group relative overflow-hidden p-5"
    >
      <div
        className={cn(
          "absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br opacity-70 transition-transform duration-500 group-hover:scale-125",
          accentMap[accent]
        )}
        aria-hidden
      />
      <div className="relative flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-background/60", accentMap[accent].split(" ").pop())}>
          {icon}
        </div>
      </div>
      <p className="num relative mt-3 text-2xl font-semibold tracking-tight">
        <AnimatedCounter value={value} currency={currency} asCurrency={asCurrency} suffix={suffix} />
      </p>
    </motion.div>
  );
}
