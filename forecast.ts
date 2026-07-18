"use client";

import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Calculator,
  PiggyBank,
  Sigma,
  TrendingUp,
} from "lucide-react";

import { AnimatedCounter } from "@/components/animated-counter";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { ForecastChart } from "@/components/forecast-chart";
import { ExplanationCard } from "@/components/explanation-card";
import { ForecastTable } from "@/components/forecast-table";
import { ExportButtons } from "@/components/export-buttons";
import type { CurrencyCode, ForecastMode, ForecastResult, MonthEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ForecastResultsProps {
  entries: MonthEntry[];
  result: ForecastResult;
  currency: CurrencyCode;
  mode: ForecastMode;
}

export function ForecastResults({ entries, result, currency, mode }: ForecastResultsProps) {
  return (
    <div className="space-y-6" id="forecast-results">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Your forecast</h2>
          <p className="text-sm text-muted-foreground">
            Projected {mode === "profit" ? "profit" : "expenses"} for the next{" "}
            {result.predictions.length} months.
          </p>
        </div>
        <ExportButtons entries={entries} result={result} currency={currency} mode={mode} />
      </div>

      {/* Predicted months — grid density adapts to the chosen horizon (3 / 6 / 12) */}
      <div
        className={cn(
          "grid gap-4",
          result.predictions.length <= 3
            ? "sm:grid-cols-3"
            : result.predictions.length <= 6
            ? "grid-cols-2 sm:grid-cols-3"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        )}
      >
        {result.predictions.map((p, i) => (
          <motion.div
            key={p.month}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.06, 0.6), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="relative overflow-hidden p-5">
              <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-sky-glow/10 text-xs font-semibold text-sky-glow num">
                {i + 1}
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Predicted month {i + 1}
              </p>
              <p className="mt-1 text-base font-semibold">{p.month}</p>
              <p className="num mt-3 text-2xl font-semibold tracking-tight text-gradient">
                <AnimatedCounter value={p.amount} currency={currency} />
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Previous average"
          value={result.historicalAverage}
          currency={currency}
          icon={<Calculator className="h-4 w-4" />}
          accent="sky"
          delay={0}
        />
        <StatCard
          label="Growth rate"
          value={result.growthRate * 100}
          currency={currency}
          icon={<TrendingUp className="h-4 w-4" />}
          accent={result.growthRate >= 0 ? "emerald" : "rose"}
          asCurrency={false}
          suffix="%"
          delay={0.05}
        />
        <StatCard
          label="Total predicted"
          value={result.totalPredicted}
          currency={currency}
          icon={<Sigma className="h-4 w-4" />}
          accent="sky"
          delay={0.1}
        />
        <StatCard
          label={`Highest — ${result.highest.month}`}
          value={result.highest.amount}
          currency={currency}
          icon={<ArrowUpFromLine className="h-4 w-4" />}
          accent="emerald"
          delay={0.15}
        />
        <StatCard
          label={`Lowest — ${result.lowest.month}`}
          value={result.lowest.amount}
          currency={currency}
          icon={<ArrowDownToLine className="h-4 w-4" />}
          accent="amber"
          delay={0.2}
        />
      </div>

      <ForecastChart entries={entries} predictions={result.predictions} currency={currency} mode={mode} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ExplanationCard result={result} />
        </div>
        <div className="lg:col-span-3">
          <ForecastTable entries={entries} predictions={result.predictions} currency={currency} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 pt-2 text-center text-xs text-muted-foreground">
        <PiggyBank className="h-3.5 w-3.5" />
        Forecasts are statistical projections based on your three historical months, not guarantees —
        the further out a month is, the less certain its number.
      </div>
    </div>
  );
}
