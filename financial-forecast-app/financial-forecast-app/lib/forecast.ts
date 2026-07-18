import type { ForecastMode, ForecastResult, MonthEntry, PredictedMonth } from "./types";

/**
 * Given the 3 historical months, return the names of the 3 months that follow.
 * Falls back to generic labels ("Month 4") if the entered names aren't
 * recognizable calendar months.
 */
function getNextMonthNames(entries: MonthEntry[]): string[] {
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const lastMonthName = entries[entries.length - 1]?.month?.trim();
  const idx = MONTHS.findIndex(
    (m) => m.toLowerCase() === lastMonthName?.toLowerCase()
  );

  if (idx === -1) {
    return ["Month 4", "Month 5", "Month 6"];
  }

  return [1, 2, 3].map((offset) => MONTHS[(idx + offset) % 12]);
}

/**
 * Ordinary least-squares linear regression over the 3 (x, y) points,
 * where x is the month index (0, 1, 2).
 */
function linearRegression(values: number[]) {
  const n = values.length;
  const xs = values.map((_, i) => i);
  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = values.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (xs[i] - xMean) * (values[i] - yMean);
    denominator += (xs[i] - xMean) ** 2;
  }

  // Guard against a zero denominator (should not happen with 3 distinct x values)
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;

  // R^2 goodness of fit
  const predicted = xs.map((x) => slope * x + intercept);
  const ssRes = values.reduce((sum, y, i) => sum + (y - predicted[i]) ** 2, 0);
  const ssTot = values.reduce((sum, y) => sum + (y - yMean) ** 2, 0);
  const rSquared = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);

  return { slope, intercept, rSquared };
}

/**
 * Weighted month-over-month growth rate. The more recent transition is
 * weighted more heavily, so a recent acceleration or slowdown has a
 * stronger influence on the projected trend than an older one.
 */
function weightedGrowthRate(values: number[]) {
  const growthRates: number[] = [];
  for (let i = 1; i < values.length; i++) {
    const prev = values[i - 1];
    if (prev === 0) {
      growthRates.push(0);
      continue;
    }
    growthRates.push((values[i] - prev) / prev);
  }

  // Weight recent transitions more heavily (weights: 1, 2, 3...)
  const weights = growthRates.map((_, i) => i + 1);
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const weighted = growthRates.reduce((sum, g, i) => sum + g * weights[i], 0) / weightSum;

  return weighted;
}

/**
 * Generate a 3-month forecast from 3 months of historical data using a
 * blend of linear regression (captures the overall trend line) and a
 * recency-weighted growth rate (captures momentum). This intentionally
 * avoids naive flat-averaging: the forecast trends up or down with the data.
 */
export function generateForecast(
  entries: MonthEntry[],
  mode: ForecastMode
): ForecastResult {
  if (entries.length !== 3) {
    throw new Error("Forecasting requires exactly 3 months of historical data.");
  }

  const values = entries.map((e) => e.amount);
  const historicalAverage = values.reduce((a, b) => a + b, 0) / values.length;

  const { slope, intercept, rSquared } = linearRegression(values);
  const growthRate = weightedGrowthRate(values);

  const lastValue = values[values.length - 1];
  const nextMonthNames = getNextMonthNames(entries);

  // Blend regression projection with compounded-trend projection.
  // Regression captures the best-fit line across all 3 points; the
  // compounded trend captures recent momentum. When the fit is strong
  // (high R^2) we lean more on regression; when it's weak/noisy we lean
  // more on the recency-weighted growth rate.
  const regressionWeight = 0.5 + rSquared * 0.2; // 0.5 - 0.7
  const trendWeight = 1 - regressionWeight;

  const predictions: PredictedMonth[] = nextMonthNames.map((month, i) => {
    const monthIndex = values.length + i; // 3, 4, 5
    const regressionValue = slope * monthIndex + intercept;
    const compoundedValue = lastValue * Math.pow(1 + growthRate, i + 1);

    const blended = regressionValue * regressionWeight + compoundedValue * trendWeight;
    const amount = Math.max(0, Math.round(blended * 100) / 100);

    return { month, amount };
  });

  const totalPredicted = predictions.reduce((sum, p) => sum + p.amount, 0);
  const highest = predictions.reduce((a, b) => (b.amount > a.amount ? b : a));
  const lowest = predictions.reduce((a, b) => (b.amount < a.amount ? b : a));

  const explanation = buildExplanation({
    mode,
    growthRate,
    slope,
    rSquared,
    entries,
    predictions,
  });

  return {
    predictions,
    historicalAverage: Math.round(historicalAverage * 100) / 100,
    growthRate,
    totalPredicted: Math.round(totalPredicted * 100) / 100,
    highest,
    lowest,
    explanation,
    slope,
    confidence: rSquared,
    method: rSquared >= 0.5 ? "linear-regression" : "weighted-trend",
  };
}

function buildExplanation(params: {
  mode: ForecastMode;
  growthRate: number;
  slope: number;
  rSquared: number;
  entries: MonthEntry[];
  predictions: PredictedMonth[];
}) {
  const { mode, growthRate, rSquared, entries, predictions } = params;

  const subject = mode === "profit" ? "Revenue" : "Expenses";
  const direction =
    growthRate > 0.005 ? "increased" : growthRate < -0.005 ? "decreased" : "stayed roughly flat";
  const pct = Math.abs(growthRate * 100);

  const trendSentence =
    direction === "stayed roughly flat"
      ? `${subject} stayed roughly flat across ${entries[0].month}, ${entries[1].month}, and ${entries[2].month}, so the forecast projects a stable trend forward.`
      : `${subject} ${direction} by approximately ${pct.toFixed(1)}% per month between ${entries[0].month} and ${entries[2].month}, so future months are projected by extending this trend using a linear regression blended with recent momentum.`;

  const confidenceSentence =
    rSquared >= 0.75
      ? "The three historical points follow a very consistent trend line, so this projection carries high confidence."
      : rSquared >= 0.4
      ? "The historical trend is moderately consistent, so this projection carries reasonable but not perfect confidence."
      : "The historical values are fairly noisy, so more weight was placed on the most recent month-over-month change than on the overall line of best fit.";

  const outlookVerb = mode === "profit" ? "earn" : "spend";
  const lastPrediction = predictions[predictions.length - 1];
  const outlookSentence = `By ${lastPrediction.month}, the model projects you'll ${outlookVerb} approximately ${lastPrediction.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}.`;

  return `${trendSentence} ${confidenceSentence} ${outlookSentence}`;
}
