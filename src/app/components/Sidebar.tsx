// src/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Expenses", href: "/expenses" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 bg-[var(--color-surface)] border-r border-[var(--border)]">
        <div className="p-6">
          <div className="text-lg font-bold text-[var(--color-primary)] mb-6">ExpenseManager</div>
          <nav className="flex flex-col gap-2">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === it.href ? "bg-[var(--primary-blue)] text-white" : "text-[var(--text-secondary)] hover:bg-[rgba(0,0,0,0.03)]"
                }`}
              >
                {it.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative w-64 h-full bg-[var(--color-surface)] p-6">
          <div className="text-lg font-bold text-[var(--color-primary)] mb-6">ExpenseManager</div>
          <nav className="flex flex-col gap-2">
            {items.map((it) => (
              <Link key={it.href} href={it.href} onClick={onClose}
                className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === it.href ? "bg-[var(--primary-blue)] text-white" : "text-[var(--text-secondary)] hover:bg-[rgba(0,0,0,0.03)]"}`}>
                {it.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
