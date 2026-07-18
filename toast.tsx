"use client";

import * as React from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

import { formatCurrency, formatNumber } from "@/lib/currency";
import type { CurrencyCode } from "@/lib/types";

interface AnimatedCounterProps {
  value: number;
  currency?: CurrencyCode;
  asCurrency?: boolean;
  className?: string;
  prefix?: string;
  suffix?: string;
}

/**
 * Counts up from 0 to `value` when it scrolls into view, using a spring
 * for a natural, premium feel rather than a linear tween.
 */
export function AnimatedCounter({
  value,
  currency = "USD",
  asCurrency = true,
  className,
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 90, damping: 24 });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  React.useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => setDisplay(latest));
    return unsubscribe;
  }, [spring]);

  const formatted = asCurrency
    ? formatCurrency(display, currency)
    : formatNumber(display, currency);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
