"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCY_LIST } from "@/lib/currency";
import type { CurrencyCode } from "@/lib/types";

interface CurrencySelectorProps {
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as CurrencyCode)}>
      <SelectTrigger className="w-[150px]" aria-label="Select currency">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        {CURRENCY_LIST.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            <span className="num mr-1.5">{c.symbol}</span>
            {c.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
