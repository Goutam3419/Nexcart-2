"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

export function CurrencySwitcher({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={cn("flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-0.5", className)}>
      {(["INR", "USD"] as const).map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={cn(
            "text-xs font-bold px-2.5 py-1 rounded-lg transition-all",
            currency === c
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          )}
        >
          {c === "INR" ? "₹" : "$"} {c}
        </button>
      ))}
    </div>
  );
}
