"use client";

import * as React from "react";

import { LoadingScreen } from "@/components/loading-screen";

const SESSION_KEY = "ledgerline:splash-shown";

/**
 * Thin session-aware wrapper around <LoadingScreen />.
 *
 * Shows the cinematic splash once per browser session (first load / hard
 * refresh) and never again on client-side route changes within the same
 * tab, so it behaves like a genuine app "boot" screen rather than a
 * page-transition overlay. Everything else in the app is untouched — this
 * component renders nothing once the splash has already played.
 */
export function AppLoadingScreen() {
  const [shouldShow, setShouldShow] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const alreadyShown = window.sessionStorage.getItem(SESSION_KEY);
      if (!alreadyShown) {
        setShouldShow(true);
      }
    } catch {
      // sessionStorage unavailable (e.g. privacy mode) — just show it once.
      setShouldShow(true);
    }
    setReady(true);
  }, []);

  const handleDone = React.useCallback(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  if (!ready || !shouldShow) return null;

  return <LoadingScreen onDone={handleDone} />;
}
