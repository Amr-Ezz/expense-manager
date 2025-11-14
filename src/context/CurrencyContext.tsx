"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useTransactions } from "@/hooks/useTransaction"; 
import ToastProvider from "@/app/components/ToastContainer"; 
import { toast } from "react-toastify";
import { TransactionsContext } from "./TransactionContext";

interface Currency {
  code: string;
  symbol: string;
}

interface CurrencyContextProps {
  currency: Currency;
  setCurrency: (code: string) => Promise<void>;
  convertAmount: (amount: number, from: string, to?: string) => Promise<number>;
}

export const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export const currencyOptions: Currency[] = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "EGP", symbol: "£" },
  { code: "GBP", symbol: "£" },
];

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>({ code: "USD", symbol: "$" });
  const transactionsContext = useContext(TransactionsContext);

  const recalculateTransactions = transactionsContext?.recalculateTransactions;
  useEffect(() => {
    const savedCode = localStorage.getItem("currencyCode");
    const savedSymbol = localStorage.getItem("currencySymbol");
    if (savedCode && savedSymbol) {
      setCurrencyState({ code: savedCode, symbol: savedSymbol });
    }
  }, []);

  const setCurrency = async (newCode: string) => {
    const newCurrency =
      currencyOptions.find((c) => c.code === newCode) || currencyOptions[0];

    if (newCurrency) {
      setCurrencyState(newCurrency);
      localStorage.setItem("currencyCode", newCurrency.code);
      localStorage.setItem("currencySymbol", newCurrency.symbol);

      try {
        if (typeof recalculateTransactions === "function") {
          await recalculateTransactions();
          toast.success(`Currency changed to ${newCurrency.code} and transactions updated!`);
        }
      } catch (error) {
        console.error("Error recalculating transactions:", error);
      }
    }
  };

  const convertAmount = async (
    amount: number,
    from: string,
    to = currency.code
  ): Promise<number> => {
    if (from === to) return amount;
    try {
      const res = await fetch(`/api/exchange?from=${from}&to=${to}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rate fetch failed");
      return amount * data.rate;
    } catch (err) {
      console.error("Error converting amount:", err);
      return amount;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};


