// src/components/Modal/AuthModal.tsx
import { useTheme } from "../../../context/ThemeContext";
import LoginForm from "../Forms/LoginForm";
import RegisterForm from "../Forms/RegisterForm";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  type: "login" | "register";
}

export default function AuthModal({ open, onClose, type }: AuthModalProps) {
  const theme = useTheme();

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.colors.surface,
          borderRadius: theme.radius.md,
          padding: "2rem",
          maxWidth: "400px",
          width: "90%",
          boxShadow: theme.shadow.lg,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ color: theme.colors.primary, marginBottom: "1rem" }}>
            {type === "login" ? "Login" : "Register"}
          </h2>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: theme.colors.textSecondary,
            }}
          >
            &times;
          </button>
        </div>

        {type === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
