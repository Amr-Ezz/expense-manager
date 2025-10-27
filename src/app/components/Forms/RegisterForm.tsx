import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      return setError("Name must be at least 2 characters.");
    }
    if (!email.includes("@")) {
      return setError("Please enter a valid email.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    try {
      await register(email, password, name);
      alert("✅ Account created successfully!");
      if (onSuccess) onSuccess();
    } catch {
      setError("❌ Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
      <button
        type="submit"
        className="bg-primary text-white font-semibold py-2 rounded hover:opacity-90"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
