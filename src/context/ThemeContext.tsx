"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type ThemeMode = "light" | "dark";

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
  text: string;
  background: string;
}

const lightTheme: Theme = {
  primary: "#F9FAFB",
  secondary: "#FFFFFF",
  accent: "#3B82F6",
  highlight: "#000000",
  text: "#111827",
  background: "#F9FAFB",
};

const darkTheme: Theme = {
  primary: "#1E201E",
  secondary: "#3C3D37",
  accent: "#697565",
  highlight: "#ECDFCC",
  text: "#ECDFCC",
  background: "#1E201E",
};

export const getTheme = (mode: ThemeMode): Theme =>
  mode === "light" ? lightTheme : darkTheme;

interface ThemeContextProps {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      const saved = localStorage.getItem("themeMode");
      if (saved === "dark" || saved === "light") setModeState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("themeMode", newMode); 
  };

  const toggleTheme = () => setMode(mode === "light" ? "dark" : "light");

  const theme = getTheme(mode);

 

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleTheme, theme }}>
      <div
        style={{
          backgroundColor: theme.background,
          color: theme.text,
          minHeight: "100vh",
          transition: "background-color 0.2s ease, color 0.2s ease",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
