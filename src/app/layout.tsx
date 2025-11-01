import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar/Navbar";
import { TransactionsProvider } from "@/context/TransactionContext";
import { ThemeProvider } from "../context/ThemeContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { AuthProvider } from "@/context/AuthContext";
import ToastProvider from "./components/ToastContainer";
import ToastContainer from "./components/ToastContainer";

export const metadata: Metadata = {
  title: "Expense Manager",
  description: "Track and manage your expenses easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface text-[#334443]">
        <ThemeProvider>
          <CurrencyProvider>
            <AuthProvider>
              <Navbar />
              <main className="pt-5 px-6">{children}</main>
              <ToastProvider />{" "}
            </AuthProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
