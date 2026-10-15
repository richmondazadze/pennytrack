"use client";
import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "pt-currency";
const CurrencyContext = createContext({ currency: "GHS", setCurrency: () => {} });

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState("GHS"); // Default currency

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCurrencyState(saved);
    } catch {}
  }, []);

  const setCurrency = (code) => {
    setCurrencyState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {}
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  return useContext(CurrencyContext);
};
