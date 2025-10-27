import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      return setError("Please enter a valid email.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    try {
      await login(email, password);
      alert("✅ Logged in successfully!");
      if (onSuccess) onSuccess();
    } catch {
      setError("❌ Login failed. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}
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
      <button
        type="submit"
        className="bg-primary text-white font-semibold py-2 rounded hover:opacity-90"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
