# Ledgerline — Financial Forecasting

A premium, glassmorphic financial forecasting dashboard. Enter three months of
profit or expense figures and Ledgerline projects the next three, using a
blend of linear regression and recency-weighted momentum — with the reasoning
shown, not hidden.

## Features

- **Profit or Expense forecasting**, switchable via tabs
- **Real forecasting math**, not a flat average:
  - Ordinary least-squares linear regression across the 3 historical points
  - A recency-weighted month-over-month growth rate (recent changes count more)
  - The two are blended adaptively based on how well the regression fits (R²)
- Plain-English explanation of *why* each forecast looks the way it does
- Predicted Month 1 / 2 / 3 cards, plus average, growth rate, total predicted,
  and highest/lowest predicted month statistics
- Interactive Recharts chart — solid historical line, dashed forecast line,
  gradient fills, animated on load, fully responsive
- Six-month table with actual/forecast badges and month-over-month change
- Currency selector (USD, EUR, UZS, GBP) with locale-aware formatting
- Export to **CSV**, **PDF** (via jsPDF), and **Print**
- Animated counters, toast notifications, loading states, empty state
- Full **dark mode / light mode**, mobile/tablet/desktop responsive
- Input validation with friendly inline errors

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) with a custom design-token theme
- [Recharts](https://recharts.org/) for charts
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Radix UI](https://www.radix-ui.com/) primitives (Select, Tabs, Toast, Label) styled shadcn/ui-style
- [Lucide](https://lucide.dev/) icons
- [jsPDF](https://github.com/parallax/jsPDF) + jspdf-autotable for PDF export
- [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deploying to Vercel

This project needs **no environment variables** and works with zero
configuration.

1. Push this folder to a GitHub/GitLab/Bitbucket repo, **or** run:
   ```bash
   npx vercel
   ```
   from inside the project folder.
2. If using the Vercel dashboard: click **Add New → Project**, import the
   repo, and click **Deploy** — Vercel auto-detects Next.js and uses
   `npm run build` / `.next` automatically.
3. That's it — no environment variables, database, or extra setup required.

## Project structure

```
app/
  layout.tsx          Root layout: fonts, theme provider, toaster
  page.tsx             Main page: state, validation, orchestration
  globals.css          Design tokens (light/dark), glass & gradient utilities
components/
  hero.tsx              Animated hero section
  forecast-input.tsx    Mode tabs + 3-month input form
  forecast-results.tsx  Results composition (predictions, stats, chart, table)
  forecast-chart.tsx    Recharts historical + forecast chart
  forecast-table.tsx    Six-month actual/forecast table
  explanation-card.tsx  Forecast methodology & reasoning
  stat-card.tsx          Reusable animated statistic card
  animated-counter.tsx  Spring-based count-up number
  currency-selector.tsx Currency dropdown
  export-buttons.tsx    CSV / PDF / print export
  empty-state.tsx       Pre-forecast empty state
  theme-toggle.tsx       Dark/light toggle
  theme-provider.tsx    next-themes wrapper
  toaster.tsx            Toast renderer
  ui/                    Button, Card, Input, Label, Select, Tabs, Toast primitives
lib/
  forecast.ts           Forecasting engine (regression + weighted trend)
  currency.ts            Currency metadata & formatting
  types.ts                Shared TypeScript types
  utils.ts                Tailwind class merge helper
hooks/
  use-toast.ts            Toast state manager
```

## How the forecast is calculated

1. **Linear regression**: fit a least-squares line through the 3 historical
   points (x = month index, y = amount). This captures the overall trend and
   produces an R² confidence score.
2. **Weighted growth rate**: compute month-over-month % change between each
   pair of consecutive months, weighting the most recent transition more
   heavily, then compound it forward.
3. **Blend**: each predicted month is a weighted average of the regression
   projection and the compounded-momentum projection. When the regression fit
   is strong (high R²), it's weighted more; when the data is noisy, recent
   momentum is weighted more.
4. Results are clamped at zero and rounded to two decimal places.

This avoids a flat/naive average forecast — the projection genuinely trends
up or down with your data, and the UI explains the trend, confidence, and
method used in plain language.

## License

MIT — do whatever you'd like with this project.
