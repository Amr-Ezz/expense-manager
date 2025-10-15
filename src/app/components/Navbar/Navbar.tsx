"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Reports", href: "/reports" },
  { name: "Transactions", href: "/Transactions" },
  {name: "Expenses", href: "/expenses"},
  { name: "Settings", href: "/settings" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-red-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          MyFinance
        </Link>

        {/* Nav Links */}
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

        {/* Sign in */}
        <Link
          href="/signin"
          className="px-5 py-2 rounded-xl bg-tertiary hover:bg-quaternary text-sm font-semibold transition"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}
