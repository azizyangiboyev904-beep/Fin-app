export type ForecastMode = "profit" | "expense";

export type ForecastHorizon = 3 | 6 | 12;

export interface MonthEntry {
  /** Display name of the month, e.g. "January" */
  month: string;
  /** Raw numeric amount entered by the user */
  amount: number;
}

export interface PredictedMonth {
  month: string;
  amount: number;
}

export type CurrencyCode = "USD" | "EUR" | "UZS" | "GBP";

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
}

export interface ForecastResult {
  /** The three predicted future months, in order */
  predictions: PredictedMonth[];
  /** Average of the three historical values */
  historicalAverage: number;
  /** Average month-over-month growth rate, expressed as a decimal (0.07 = 7%) */
  growthRate: number;
  /** Sum of the three predicted values */
  totalPredicted: number;
  /** Highest predicted month */
  highest: PredictedMonth;
  /** Lowest predicted month */
  lowest: PredictedMonth;
  /** Human-readable explanation of the methodology and result */
  explanation: string;
  /** Slope of the fitted linear regression line (amount per month) */
  slope: number;
  /** R^2 goodness of fit for the regression, 0-1 */
  confidence: number;
  /** The forecasting method actually used, for transparency */
  method: "linear-regression" | "weighted-trend";
}

export interface ChartPoint {
  month: string;
  historical: number | null;
  forecast: number | null;
  index: number;
}
