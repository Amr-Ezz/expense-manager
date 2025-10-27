// src/components/Forms/LoginForm.tsx
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";
import { useState } from "react";

export default function LoginForm() {
  const theme = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      alert("Login successful!");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };


  return (
    <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input
        type="email"
        placeholder="Email"
        style={{
          padding: "0.75rem 1rem",
          border: `1px solid ${theme.theme.secondary}`,
          
        }}
      />
      <input
        type="password"
        placeholder="Password"
        style={{
          padding: "0.75rem 1rem",
          border: `1px solid ${theme.theme.secondary}`,
          
        }}
      />
      <button
        type="submit"
        style={{
          background: theme.theme.accent,
          color: "white",
          padding: "0.75rem 1rem",
          border: "none",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </form>
  );
}
