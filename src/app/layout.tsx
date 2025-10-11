import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar/Navbar";

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
      <body className="bg-red-500 text-[#334443]">
        <Navbar />
        <main className="pt-20 px-6">{children}</main>
      </body>
    </html>
  );
}
