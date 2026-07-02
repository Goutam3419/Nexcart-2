"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type Currency = "INR" | "USD";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (amount: number) => string;
  convert: (amount: number) => number;
  symbol: string;
}

const USD_TO_INR = 83.5;

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "INR",
  setCurrency: () => {},
  format: (n) => `₹${n}`,
  convert: (n) => n,
  symbol: "₹",
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("INR");

  const convert = useCallback(
    (amount: number) => {
      if (currency === "INR") return amount * USD_TO_INR;
      return amount;
    },
    [currency]
  );

  const format = useCallback(
    (amount: number) => {
      const converted = convert(amount);
      if (currency === "INR") {
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(converted);
      }
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(amount);
    },
    [currency, convert]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        format,
        convert,
        symbol: currency === "INR" ? "₹" : "$",
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
