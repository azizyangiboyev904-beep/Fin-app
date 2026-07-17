"use client";

import * as React from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "next-themes";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import type { CurrencyCode, ForecastMode, MonthEntry, PredictedMonth } from "@/lib/types";

interface ForecastChartProps {
  entries: MonthEntry[];
  predictions: PredictedMonth[];
  currency: CurrencyCode;
  mode: ForecastMode;
}

export function ForecastChart({ entries, predictions, currency, mode }: ForecastChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const data = React.useMemo(() => {
    const historicalPoints = entries.map((e, i) => ({
      month: e.month,
      historical: e.amount,
      forecast: null as number | null,
      index: i,
    }));

    // Bridge point: the last historical month also seeds the forecast line
    // so the two segments connect visually instead of leaving a gap.
    const bridge = {
      month: entries[entries.length - 1].month,
      historical: entries[entries.length - 1].amount,
      forecast: entries[entries.length - 1].amount,
      index: entries.length - 1,
    };

    const forecastPoints = predictions.map((p, i) => ({
      month: p.month,
      historical: null as number | null,
      forecast: p.amount,
      index: entries.length + i,
    }));

    return [...historicalPoints.slice(0, -1), bridge, ...forecastPoints];
  }, [entries, predictions]);

  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const axisColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.45)";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {mode === "profit" ? "Profit" : "Expense"} trajectory
        </CardTitle>
        <CardDescription>
          Solid line shows what happened. Dashed line shows what&apos;s projected.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-glow" />
            Historical
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sky-glow" />
            Forecast
          </div>
        </div>

        <div className="h-[340px] w-full sm:h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 16, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="historicalFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34D399" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="month"
                stroke={axisColor}
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: gridColor }}
                dy={8}
              />
              <YAxis
                stroke={axisColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={64}
                tickFormatter={(v) => formatCompact(v, currency)}
              />
              <Tooltip content={<ChartTooltip currency={currency} />} />

              <Area
                type="monotone"
                dataKey="historical"
                stroke="none"
                fill="url(#historicalFill)"
                isAnimationActive
                animationDuration={900}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="none"
                fill="url(#forecastFill)"
                isAnimationActive
                animationDuration={900}
                animationBegin={300}
              />

              <Line
                type="monotone"
                dataKey="historical"
                stroke="#34D399"
                strokeWidth={3}
                dot={{ r: 4, fill: "#34D399", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                isAnimationActive
                animationDuration={900}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#38BDF8"
                strokeWidth={3}
                strokeDasharray="6 5"
                dot={{ r: 4, fill: "#38BDF8", strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                isAnimationActive
                animationDuration={900}
                animationBegin={300}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function formatCompact(value: number, currency: CurrencyCode) {
  if (value === 0) return formatCurrency(0, currency).replace(/0([.,]0+)?$/, "0");
  const abs = Math.abs(value);
  const symbol = formatCurrency(0, currency).replace(/[\d.,\s]/g, "");
  if (abs >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${symbol}${(value / 1_000).toFixed(1)}K`;
  return `${symbol}${value.toFixed(0)}`;
}

function ChartTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
  currency: CurrencyCode;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload.find((p) => p.value !== null && p.value !== undefined);
  if (!point) return null;

  const isForecast = point.dataKey === "forecast";

  return (
    <div className="glass-panel px-3.5 py-2.5 text-sm shadow-glass">
      <p className="mb-1 font-medium">{label}</p>
      <p className="num flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: isForecast ? "#38BDF8" : "#34D399" }}
        />
        {formatCurrency(point.value, currency)}
        <span className="ml-1 text-xs text-muted-foreground">
          {isForecast ? "projected" : "actual"}
        </span>
      </p>
    </div>
  );
}
