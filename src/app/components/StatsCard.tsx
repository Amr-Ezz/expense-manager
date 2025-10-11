// src/components/StatsCard.tsx
"use client";

export default function StatsCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="text-sm text-[var(--text-secondary)]">{title}</div>
      <div className="mt-2 text-2xl font-bold text-[var(--color-primary)]">{value}</div>
    </div>
  );
}
