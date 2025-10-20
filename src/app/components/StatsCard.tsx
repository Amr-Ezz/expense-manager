"use client";

import { useTheme } from "@/context/ThemeContext";

export default function StatsCard({ title, value }: { title: string; value: string }) {
  const {theme} = useTheme();
  return (
    <div className={`bg-${theme.background} border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:shadow-md transition`}>
      <div className="text-sm text-[var(--text-secondary)]">{title}</div>
      <div className="mt-2 text-2xl font-bold text-[var(--color-primary)]">{value}</div>
    </div>
  );
}
