"use client";

import { apiRequest } from "@/lib/api";
import { User } from "@/types";
import { createContext, useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";
import { useCurrency } from "../hooks/useCurrency"; 

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { setMode } = useTheme();
  const { setCurrency } = useCurrency();

  const fetchUserSettings = async (userId: string) => {
    try {
      const res = await fetch(`/api/settings?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch settings");
      return await res.json();
    } catch (error) {
      console.error("Error fetching user settings:", error);
      return null;
    }
  };

  const applyUserSettings = (settings: any) => {
    if (!settings) return;
    if (settings.theme) {
      setMode(settings.theme);
      localStorage.setItem("themeMode", settings.theme);
    }
    if (settings.currency) {
      setCurrency(settings.currency);
      localStorage.setItem("currency", settings.currency);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiRequest("/api/users", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      const settings = await fetchUserSettings(data.user.id);
      const updatedUser = { ...data.user, settings };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      applyUserSettings(settings);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiRequest("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const settings = await fetchUserSettings(data.user.id);
      const updatedUser = { ...data.user, settings };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      applyUserSettings(settings);
    } catch (error: any) {
      console.error("🚫 Login failed:", error.message || error);
      alert(`Login failed: ${error.message || "Unknown error"}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("currency");
    localStorage.setItem("themeMode", "light");
    setMode("light");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsed = JSON.parse(storedUser);
    setUser(parsed);

    const initSettings = async () => {
      try {
        const settings = await fetchUserSettings(parsed.id);
        if (settings) {
          const updatedUser = { ...parsed, settings };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          applyUserSettings(settings);
        }
      } catch (err) {
        console.error("⚠️ Failed to load user settings on init:", err);
        if (parsed?.settings) applyUserSettings(parsed.settings);
      }
    };

    initSettings();
  }, []); 

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
