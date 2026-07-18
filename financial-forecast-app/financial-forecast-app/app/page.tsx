"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Heart } from "lucide-react";

import { Hero } from "@/components/hero";
import { ForecastInput } from "@/components/forecast-input";
import { ForecastResults } from "@/components/forecast-results";
import { EmptyState } from "@/components/empty-state";
import { generateForecast } from "@/lib/forecast";
import { useToast } from "@/hooks/use-toast";
import type { CurrencyCode, ForecastMode, ForecastResult, MonthEntry } from "@/lib/types";

const EMPTY_ENTRIES: MonthEntry[] = [
  { month: "", amount: 0 },
  { month: "", amount: 0 },
  { month: "", amount: 0 },
];

const EXAMPLE_DATA: Record<ForecastMode, MonthEntry[]> = {
  profit: [
    { month: "January", amount: 4500 },
    { month: "February", amount: 5200 },
    { month: "March", amount: 4900 },
  ],
  expense: [
    { month: "January", amount: 2100 },
    { month: "February", amount: 2350 },
    { month: "March", amount: 2600 },
  ],
};

export default function HomePage() {
  const { toast } = useToast();

  const [mode, setMode] = React.useState<ForecastMode>("profit");
  const [entries, setEntries] = React.useState<MonthEntry[]>(EMPTY_ENTRIES);
  const [currency, setCurrency] = React.useState<CurrencyCode>("USD");
  const [result, setResult] = React.useState<ForecastResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleModeChange = (next: ForecastMode) => {
    setMode(next);
    setResult(null);
  };

  const validate = (): string | null => {
    for (const [i, entry] of entries.entries()) {
      if (!entry.month.trim()) return `Enter a month name for row ${i + 1}.`;
      if (Number.isNaN(entry.amount)) return `Enter a valid amount for ${entry.month || `row ${i + 1}`}.`;
      if (entry.amount < 0) return `Amounts can't be negative — check ${entry.month}.`;
    }
    const months = entries.map((e) => e.month.trim().toLowerCase());
    if (new Set(months).size !== months.length) {
      return "Each month should be entered only once.";
    }
    return null;
  };

  const handleGenerate = () => {
    const error = validate();
    if (error) {
      toast({ title: "Check your inputs", description: error, variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    // A short, deliberate delay so the loading state (and its micro-interaction)
    // is perceptible — forecasting itself is instant client-side math.
    window.setTimeout(() => {
      try {
        const forecast = generateForecast(entries, mode);
        setResult(forecast);
        toast({
          title: "Forecast generated",
          description: `Projected ${mode === "profit" ? "profit" : "expenses"} for the next 3 months are ready.`,
        });
        window.requestAnimationFrame(() => {
          document.getElementById("forecast-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      } catch (e) {
        toast({
          title: "Couldn't generate forecast",
          description: e instanceof Error ? e.message : "Something went wrong.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 700);
  };

  const handleReset = () => {
    setEntries(EMPTY_ENTRIES);
    setResult(null);
    toast({ title: "Cleared", description: "Your inputs were reset." });
  };

  const handleLoadExample = () => {
    setEntries(EXAMPLE_DATA[mode]);
    setResult(null);
    toast({ title: "Example loaded", description: "Sample data has been filled in — generate away." });
  };

  return (
    <main className="min-h-screen">
      <Hero />

      <div className="container py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[420px_1fr] lg:items-start lg:gap-10">
          <div className="lg:sticky lg:top-8">
            <ForecastInput
              mode={mode}
              onModeChange={handleModeChange}
              entries={entries}
              onEntriesChange={setEntries}
              currency={currency}
              onCurrencyChange={setCurrency}
              onGenerate={handleGenerate}
              onReset={handleReset}
              onLoadExample={handleLoadExample}
              isLoading={isLoading}
            />
          </div>

          <div>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ForecastResults entries={entries} result={result} currency={currency} mode={mode} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <EmptyState />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <footer className="no-print border-t border-border/60 py-8">
        <div className="container flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-3 w-3 fill-rose-glow text-rose-glow" /> using Next.js &amp; Recharts
          </p>
          <p>Forecasts are estimates, not financial advice.</p>
        </div>
      </footer>
    </main>
  );
}
