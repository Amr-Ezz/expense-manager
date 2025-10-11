// src/context/ThemeContext.tsx
"use client";
import { createContext, useContext, ReactNode } from "react";

const theme = {
  colors: {
    background: "#FAF8F1",
    surface: "#FAEAB1",
    primary: "#34656D",
    secondary: "#334443",
    text: "#111827",
    textSecondary: "#6B7280",
    textTertiary: "#9CA3AF",
    success: "#10B981",
    danger: "#EF4444",
  },
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
  },
  shadow: {
    sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.1)",
  },
};

type ThemeContextType = typeof theme;

const ThemeContext = createContext<ThemeContextType>(theme);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
