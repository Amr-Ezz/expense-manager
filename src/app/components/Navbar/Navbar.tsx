"use client";

import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AuthModal from "../Modal/AuthModal";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Reports", href: "/reports" },
  { name: "Transactions", href: "/Transactions" },
  { name: "Expenses", href: "/expenses" },
  { name: "Settings", href: "/settings" },
];

export default function Navbar() {
  const themeContext = useTheme();

  if (!themeContext) {
    throw new Error(
      "ThemeContext is undefined. Make sure your component is wrapped in ThemeProvider."
    );
  }
  const { theme } = themeContext;
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const handleLogout = () => {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      logout();
    }
  };
  const [modal, setModal] = useState<"login" | "register">("login");
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (mode: "login" | "register") => {
    setModal(mode);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  }

  return (
    <nav className={`bg-${theme.accent} text-${theme.text} shadow-md`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-wide">
          MyFinance
        </Link>

        <div className="md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition ${
                pathname === item.href
                  ? "text-tertiary border-b-2 border-tertiary pb-1"
                  : "hover:text-quaternary"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button className="hover:underline" onClick={() => openModal("login")}>Login</button>
              <button className="hover:underline" onClick={() => openModal("register")}>Register</button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span>Hello, {user.name || "User"} 👋</span>
              <button
                onClick={handleLogout}
                className="bg-secondary px-3 py-1 rounded hover:opacity-90"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
            {modalOpen && <AuthModal onClose={closeModal} mode={modal} />}
    </nav>
    
  );
}
