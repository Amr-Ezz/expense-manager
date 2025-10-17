// src/context/ThemeContext.tsx
"use client";
import {
  createContext,
  useContext,
  ReactNode,
  use,
  useState,
  useEffect,
} from "react";

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
  text: string;
  background: string;
}
interface ThemeProviderProps {
  theme: Theme;
  mode: "light" | "dark";
  toggleTheme?: () => void;
}
const lightTheme: Theme = {
  primary: "#F5F5F5",
  secondary: "#FFFFFF",
  accent: "#3B82F6",
  highlight: "#000000",
  text: "#000000",
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

const ThemeContext = createContext<ThemeProviderProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  useEffect(() => {
    const storedMode = localStorage.getItem("themeMode") as
      | "light"
      | "dark"
      | null;
    if (storedMode === "light" || storedMode === "dark") {
      setMode(storedMode);
    }
  }, []);
  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };
  const theme = mode === "light" ? lightTheme : darkTheme;
  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
