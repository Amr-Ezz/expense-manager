import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar/Navbar";
import { TransactionsProvider } from "@/context/TransactionContext";

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
        <TransactionsProvider>

        <Navbar />
        <main className="pt-20 px-6">{children}</main>
        </TransactionsProvider>
      </body>
    </html>
  );
}
