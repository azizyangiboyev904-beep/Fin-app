"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Calendar, RotateCcw, Sparkles, TrendingDown, TrendingUp, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrencySelector } from "@/components/currency-selector";
import { CURRENCIES } from "@/lib/currency";
import type { CurrencyCode, ForecastHorizon, ForecastMode, MonthEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ForecastInputProps {
  mode: ForecastMode;
  onModeChange: (mode: ForecastMode) => void;
  entries: MonthEntry[];
  onEntriesChange: (entries: MonthEntry[]) => void;
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  horizon: ForecastHorizon;
  onHorizonChange: (horizon: ForecastHorizon) => void;
  onGenerate: () => void;
  onReset: () => void;
  onLoadExample: () => void;
  isLoading: boolean;
}

const HORIZON_OPTIONS: { value: ForecastHorizon; label: string }[] = [
  { value: 3, label: "3 months" },
  { value: 6, label: "6 months" },
  { value: 12, label: "12 months" },
];

export function ForecastInput({
  mode,
  onModeChange,
  entries,
  onEntriesChange,
  currency,
  onCurrencyChange,
  horizon,
  onHorizonChange,
  onGenerate,
  onReset,
  onLoadExample,
  isLoading,
}: ForecastInputProps) {
  const updateEntry = (index: number, field: keyof MonthEntry, value: string) => {
    const next = [...entries];
    next[index] = {
      ...next[index],
      [field]: field === "amount" ? Number(value) : value,
    };
    onEntriesChange(next);
  };

  const symbol = CURRENCIES[currency].symbol;

  return (
    <Card id="forecast-input" className="scroll-mt-24">
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-xl">Your last 3 months</CardTitle>
          <CardDescription className="mt-1">
            Choose what you&apos;re forecasting, how far ahead, then enter each month&apos;s figure.
          </CardDescription>
        </div>
        <CurrencySelector value={currency} onChange={onCurrencyChange} />
      </CardHeader>

      <CardContent className="space-y-7">
        <Tabs value={mode} onValueChange={(v) => onModeChange(v as ForecastMode)}>
          <TabsList className="grid w-full grid-cols-2 sm:w-[320px]">
            <TabsTrigger value="profit" className="gap-1.5">
              <TrendingUp className="h-4 w-4" />
              Profit
            </TabsTrigger>
            <TabsTrigger value="expense" className="gap-1.5">
              <TrendingDown className="h-4 w-4" />
              Expense
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div>
          <Label className="mb-2.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Forecast how far ahead?
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {HORIZON_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onHorizonChange(opt.value)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  horizon === opt.value
                    ? "border-transparent bg-gradient-to-br from-emerald-glow to-sky-glow text-white shadow-glow"
                    : "border-border/60 bg-muted/30 text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="grid grid-cols-[auto_1fr_1fr] items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3 sm:p-3.5"
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold num",
                  "bg-background/70 text-muted-foreground"
                )}
              >
                {i + 1}
              </div>

              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label={`Month ${i + 1} name`}
                  placeholder="Month name"
                  value={entry.month}
                  onChange={(e) => updateEntry(i, "month", e.target.value)}
                  className="pl-9"
                  list="month-suggestions"
                />
              </div>

              <div className="relative">
                <span className="num pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {symbol}
                </span>
                <Input
                  aria-label={`Month ${i + 1} amount`}
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  min={0}
                  step="0.01"
                  value={Number.isNaN(entry.amount) || entry.amount === 0 ? "" : entry.amount}
                  onChange={(e) => updateEntry(i, "amount", e.target.value)}
                  className="num pl-9"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <datalist id="month-suggestions">
          {[
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
          ].map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <Button
            size="lg"
            className="flex-1 gap-2"
            onClick={onGenerate}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <motion.span
                  className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                />
                Calculating forecast…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate forecast
              </>
            )}
          </Button>
          <Button variant="glass" size="lg" className="gap-2" onClick={onLoadExample} disabled={isLoading}>
            <Wand2 className="h-4 w-4" />
            Load example
          </Button>
          <Button variant="ghost" size="lg" className="gap-2" onClick={onReset} disabled={isLoading}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
