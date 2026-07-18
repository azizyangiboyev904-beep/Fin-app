@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 220 20% 97%;
    --foreground: 222 33% 10%;

    --card: 0 0% 100%;
    --card-foreground: 222 33% 10%;

    --popover: 0 0% 100%;
    --popover-foreground: 222 33% 10%;

    --muted: 220 16% 93%;
    --muted-foreground: 220 10% 42%;

    --border: 220 14% 88%;
    --input: 220 14% 88%;

    --primary: 160 84% 32%;
    --primary-foreground: 0 0% 100%;

    --secondary: 199 89% 42%;
    --secondary-foreground: 0 0% 100%;

    --accent: 220 16% 93%;
    --accent-foreground: 222 33% 10%;

    --destructive: 351 83% 55%;
    --destructive-foreground: 0 0% 100%;

    --ring: 160 84% 32%;

    --radius: 16px;

    --glass-bg: 255 255 255 / 0.65;
    --glass-border: 15 23 42 / 0.08;
  }

  .dark {
    --background: 222 35% 5%;
    --foreground: 210 20% 93%;

    --card: 222 30% 8%;
    --card-foreground: 210 20% 93%;

    --popover: 222 30% 8%;
    --popover-foreground: 210 20% 93%;

    --muted: 222 22% 13%;
    --muted-foreground: 215 14% 62%;

    --border: 222 20% 17%;
    --input: 222 20% 17%;

    --primary: 160 74% 46%;
    --primary-foreground: 222 35% 5%;

    --secondary: 199 89% 56%;
    --secondary-foreground: 222 35% 5%;

    --accent: 222 22% 13%;
    --accent-foreground: 210 20% 93%;

    --destructive: 351 89% 63%;
    --destructive-foreground: 210 20% 93%;

    --ring: 160 74% 46%;

    --glass-bg: 15 18 26 / 0.55;
    --glass-border: 255 255 255 / 0.08;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  }
  ::selection {
    @apply bg-primary/25;
  }
}

@layer utilities {
  /* Tabular numerals for every financial figure — the app's typographic signature */
  .num {
    font-family: ui-monospace, "SF Mono", "Cascadia Code", "Roboto Mono", Menlo, Consolas, monospace;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.01em;
  }

  .glass {
    background-color: rgb(var(--glass-bg));
    border: 1px solid rgb(var(--glass-border));
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
  }

  .glass-panel {
    @apply glass rounded-2xl shadow-glass;
  }

  .bg-mesh {
    background-image: theme("backgroundImage.mesh-dark");
  }
  .dark .bg-mesh {
    background-image: theme("backgroundImage.mesh-dark");
  }
  :not(.dark) .bg-mesh {
    background-image: theme("backgroundImage.mesh-light");
  }

  .text-gradient {
    background: linear-gradient(120deg, #34d399 0%, #38bdf8 60%, #38bdf8 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .shimmer-text {
    background: linear-gradient(
      110deg,
      hsl(var(--muted-foreground)) 30%,
      hsl(var(--foreground)) 50%,
      hsl(var(--muted-foreground)) 70%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: shimmer 2.5s linear infinite;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}

/* Focus visibility for accessibility */
:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

@media print {
  .no-print {
    display: none !important;
  }
  body {
    background: white !important;
  }
}
