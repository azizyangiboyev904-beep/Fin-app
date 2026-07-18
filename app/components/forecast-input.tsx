"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Gauge } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ForecastResult } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ExplanationCardProps {
  result: ForecastResult;
}

export function ExplanationCard({ result }: ExplanationCardProps) {
  const confidencePct = Math.round(result.confidence * 100);
  const methodLabel =
    result.method === "linear-regression"
      ? "Linear regression (trend-dominant)"
      : "Weighted recent-momentum trend";

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-glow/20 to-sky-glow/20">
          <BrainCircuit className="h-5 w-5 text-sky-glow" />
        </div>
        <div>
          <CardTitle className="text-lg">Why these numbers</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-[15px] leading-relaxed text-muted-foreground">{result.explanation}</p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5">
            <p className="text-xs text-muted-foreground">Method</p>
            <p className="mt-1 text-sm font-medium leading-tight">{methodLabel}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5">
            <p className="text-xs text-muted-foreground">Monthly growth</p>
            <p
              className={cn(
                "num mt-1 text-sm font-medium",
                result.growthRate > 0 ? "text-emerald-glow" : result.growthRate < 0 ? "text-rose-glow" : ""
              )}
            >
              {result.growthRate >= 0 ? "+" : ""}
              {(result.growthRate * 100).toFixed(1)}%
            </p>
          </div>
          <div className="col-span-2 rounded-xl border border-border/60 bg-muted/30 p-3.5 sm:col-span-1">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Gauge className="h-3 w-3" /> Confidence
              </p>
              <span className="num text-xs font-medium">{confidencePct}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-glow to-sky-glow"
                initial={{ width: 0 }}
                animate={{ width: `${confidencePct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
