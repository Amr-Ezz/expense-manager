"use client";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AuthModal from "../Modal/AuthModal";
import { NAV_ITEMS, NAVBAR_CONFIG } from "@/lib/navigation"

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

  const [modal, setModal] = useState<"login" | "register">("login");
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Listen for auth modal events from other components
  useEffect(() => {
    const handleOpenAuthModal = (event: CustomEvent<"login" | "register">) => {
      openModal(event.detail);
    };

    window.addEventListener('openAuthModal' as any, handleOpenAuthModal);

    return () => {
      window.removeEventListener('openAuthModal' as any, handleOpenAuthModal);
    };
  }, []);

  const handleLogout = () => {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      logout();
      setMobileMenuOpen(false);
    }
  };

  const openModal = (mode: "login" | "register") => {
    setModal(mode);
    setModalOpen(true);
    setMobileMenuOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-white shadow-md sticky top-0 z-40">
      <div className={`${NAVBAR_CONFIG.maxWidth} mx-auto ${NAVBAR_CONFIG.padding.x} ${NAVBAR_CONFIG.padding.y}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold tracking-wide hover:opacity-80 transition"
            onClick={closeMobileMenu}
          >
            {NAVBAR_CONFIG.brandName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition ${
                  pathname === item.href
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1"
                    : "hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <button
                  className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition"
                  onClick={() => openModal("login")}
                >
                  Login
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  onClick={() => openModal("register")}
                >
                  Register
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm">Hello, {user.name || "User"} 👋</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              // Close Icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger Icon
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-2 mt-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    pathname === item.href
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Section */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {!user ? (
                <div className="flex flex-col space-y-2">
                  <button
                    className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    onClick={() => openModal("login")}
                  >
                    Login
                  </button>
                  <button
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                    onClick={() => openModal("register")}
                  >
                    Register
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <div className="px-4 py-2 text-sm">
                    Hello, <span className="font-semibold">{user.name || "User"}</span> 👋
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {modalOpen && <AuthModal onClose={closeModal} mode={modal} />}
    </nav>
  );
}