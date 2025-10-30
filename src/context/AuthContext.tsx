"use client";
import { apiRequest } from "@/lib/api";
import { User } from "@/types";
import { createContext, useEffect, useState } from "react";

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

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    setLoading(true);
    try {
      const data = await apiRequest("/api/users", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

const login = async (email: string, password: string): Promise<void> => {
  setLoading(true);
  try {
    const data = await apiRequest("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    console.log("✅ Login data received:", data);
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
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
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
