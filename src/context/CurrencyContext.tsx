"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Currency {
  code: string;
symbol: string;
};
 interface CurrencyContextProps {
  currency: Currency;
  setCurrency: (code: string) => void;
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

  useEffect(() => {
    const savedCode = localStorage.getItem("currencyCode");
    const savedSymbol = localStorage.getItem("currencySymbol");
    if (savedCode && savedSymbol) {
      setCurrencyState({ code: savedCode, symbol: savedSymbol });
    }
  }, []);

  const setCurrency = (newCode: string) => {
    const newCurrency = currencyOptions.find((c) => c.code === newCode) || currencyOptions[0];
    if (newCurrency) {
      setCurrencyState(newCurrency);
      localStorage.setItem("currencyCode", newCurrency.code);
      localStorage.setItem("currencySymbol", newCurrency.symbol);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};


