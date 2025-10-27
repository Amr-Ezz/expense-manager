// src/components/Forms/RegisterForm.tsx
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";
import { useState } from "react";

export default function RegisterForm() {
  const theme = useTheme();
  const {register} = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(fullName, email, password);
      alert("Registration successful!");
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        className="p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="p-2 border rounded"
      />
      <button type="submit" className="bg-primary text-white py-2 rounded">
        Register
      </button>
    </form>
  );
}
