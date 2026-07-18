"use client";

import { motion } from "framer-motion";
import { LineChart } from "lucide-react";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel flex flex-col items-center justify-center gap-4 px-8 py-20 text-center"
    >
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-glow/15 to-sky-glow/15">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <LineChart className="h-7 w-7 text-sky-glow" strokeWidth={1.75} />
        </motion.div>
      </div>
      <div className="max-w-sm space-y-1.5">
        <h3 className="text-base font-semibold">No forecast yet</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Fill in three months of data on the left and generate a forecast — your
          projected chart, statistics, and explanation will appear here.
        </p>
      </div>
    </motion.div>
  );
}
