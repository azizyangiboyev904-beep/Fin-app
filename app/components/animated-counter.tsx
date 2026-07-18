import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/toaster";
import { AppLoadingScreen } from "@/components/app-loading-screen";
import "./globals.css";

// Using the native OS font stack (San Francisco / Segoe UI / Roboto) instead of
// next/font/google. This removes any build-time network dependency on Google Fonts,
// ships zero extra font bytes, and avoids layout shift — the same approach used by
// Linear, Stripe, and Vercel's own dashboard. See tailwind.config.ts for the stack.

export const metadata: Metadata = {
  title: "Ledgerline — Financial Forecasting",
  description:
    "Enter three months of profit or expense data and get an intelligent three-month forecast, powered by trend regression and momentum analysis.",
  metadataBase: new URL("https://ledgerline.vercel.app"),
  openGraph: {
    title: "Ledgerline — Financial Forecasting",
    description:
      "Turn three months of financial data into a confident three-month forecast.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F7F9" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0D12" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AppLoadingScreen />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
