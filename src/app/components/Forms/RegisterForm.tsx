// src/components/Forms/RegisterForm.tsx
import { useTheme } from "../../../context/ThemeContext";

export default function RegisterForm() {
  const theme = useTheme();

  return (
    <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input
        type="text"
        placeholder="Full Name"
        style={{
          padding: "0.75rem 1rem",
          border: `1px solid ${theme.colors.secondary}`,
          borderRadius: theme.radius.sm,
        }}
      />
      <input
        type="email"
        placeholder="Email"
        style={{
          padding: "0.75rem 1rem",
          border: `1px solid ${theme.colors.secondary}`,
          borderRadius: theme.radius.sm,
        }}
      />
      <input
        type="password"
        placeholder="Password"
        style={{
          padding: "0.75rem 1rem",
          border: `1px solid ${theme.colors.secondary}`,
          borderRadius: theme.radius.sm,
        }}
      />
      <button
        type="submit"
        style={{
          background: theme.colors.primary,
          color: "white",
          padding: "0.75rem 1rem",
          border: "none",
          borderRadius: theme.radius.sm,
          cursor: "pointer",
        }}
      >
        Register
      </button>
    </form>
  );
}
