// src/components/Forms/LoginForm.tsx
import { useTheme } from "../../../context/ThemeContext";

export default function LoginForm() {
  const theme = useTheme();

  return (
    <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
        Login
      </button>
    </form>
  );
}
