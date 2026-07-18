"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import type { CurrencyCode, MonthEntry, PredictedMonth } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ForecastTableProps {
  entries: MonthEntry[];
  predictions: PredictedMonth[];
  currency: CurrencyCode;
}

export function ForecastTable({ entries, predictions, currency }: ForecastTableProps) {
  const allValues = [...entries.map((e) => e.amount), ...predictions.map((p) => p.amount)];

  const rows = [
    ...entries.map((e) => ({ ...e, type: "actual" as const })),
    ...predictions.map((p) => ({ ...p, type: "forecast" as const })),
  ];

  return (
    <Card id="forecast-table">
      <CardHeader>
        <CardTitle className="text-xl">Six-month view</CardTitle>
        <CardDescription>Actuals followed by the three-month projection.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Month</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="px-4 py-3 text-right font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const prevValue = i > 0 ? allValues[i - 1] : null;
                const change =
                  prevValue !== null && prevValue !== 0 ? (row.amount - prevValue) / prevValue : null;

                return (
                  <motion.tr
                    key={`${row.month}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                    className={cn(
                      "border-b border-border/40 last:border-0 transition-colors hover:bg-muted/30",
                      row.type === "forecast" && "bg-sky-glow/[0.03]"
                    )}
                  >
                    <td className="px-4 py-3 font-medium">{row.month}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          row.type === "actual"
                            ? "bg-emerald-glow/10 text-emerald-glow"
                            : "bg-sky-glow/10 text-sky-glow"
                        )}
                      >
                        {row.type === "actual" ? "Actual" : "Forecast"}
                      </span>
                    </td>
                    <td className="num px-4 py-3 text-right font-medium">
                      {formatCurrency(row.amount, currency)}
                    </td>
                    <td className="num px-4 py-3 text-right">
                      {change === null ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <span
                          className={cn(
                            "inline-flex items-center justify-end gap-0.5",
                            change > 0.001
                              ? "text-emerald-glow"
                              : change < -0.001
                              ? "text-rose-glow"
                              : "text-muted-foreground"
                          )}
                        >
                          {change > 0.001 ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : change < -0.001 ? (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                          ) : (
                            <Minus className="h-3.5 w-3.5" />
                          )}
                          {(Math.abs(change) * 100).toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
