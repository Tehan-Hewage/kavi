"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// ---------------------------------------------------------------------------
// Supported currencies (all prices in the app are stored as LKR)
// ---------------------------------------------------------------------------
export type SupportedCurrency = "LKR" | "USD" | "GBP" | "AUD" | "CAD" | "EUR";

// Approximate LKR → target exchange rates (LKR as base = 1).
// Update these values to wire in a live-rate API later.
const LKR_RATES: Record<SupportedCurrency, number> = {
  LKR: 1,
  USD: 1 / 300,
  GBP: 1 / 380,
  AUD: 1 / 195,
  CAD: 1 / 220,
  EUR: 1 / 325,
};

const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  LKR: "Rs",
  USD: "$",
  GBP: "£",
  AUD: "A$",
  CAD: "C$",
  EUR: "€",
};

// Locale to use for Intl.NumberFormat per currency
const CURRENCY_LOCALES: Record<SupportedCurrency, string> = {
  LKR: "en-LK",
  USD: "en-US",
  GBP: "en-GB",
  AUD: "en-AU",
  CAD: "en-CA",
  EUR: "de-DE",
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
interface CurrencyContextProps {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  symbol: string;
  /** Convert a raw LKR amount to the currently-selected currency. */
  convertPrice: (lkrAmount: number) => number;
  /** Convert + format a raw LKR amount as a localised currency string. */
  formatPrice: (lkrAmount: number) => string;
}

export const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<SupportedCurrency>("LKR");

  useEffect(() => {
    const saved = localStorage.getItem("kavi_currency") as SupportedCurrency;
    if (saved && saved in LKR_RATES) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (curr: SupportedCurrency) => {
    setCurrencyState(curr);
    localStorage.setItem("kavi_currency", curr);
  };

  const symbol = CURRENCY_SYMBOLS[currency];

  const convertPrice = (lkrAmount: number): number => {
    if (currency === "LKR") return lkrAmount;
    return parseFloat((lkrAmount * LKR_RATES[currency]).toFixed(2));
  };

  const formatPrice = (lkrAmount: number): string => {
    const converted = convertPrice(lkrAmount);
    if (currency === "LKR") {
      return (
        new Intl.NumberFormat("en-LK", {
          style: "currency",
          currency: "LKR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
          .format(converted)
          .replace("LKR", "Rs")
      );
    }
    return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, symbol, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
};
