// src/components/RecentTransactions.tsx
"use client";

export default function RecentTransactions({ transactions }: { transactions?: Array<{id:number; name:string; amount:number; date:string}> }) {
  const sample = transactions ?? [
    { id: 1, name: "Groceries", amount: -54.32, date: "2025-10-01" },
    { id: 2, name: "Salary", amount: 1200.0, date: "2025-10-03" },
    { id: 3, name: "Electricity Bill", amount: -75.5, date: "2025-10-05" },
  ];

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Transactions</h3>
      <ul className="divide-y divide-[var(--border)]">
        {sample.map((tx) => (
          <li key={tx.id} className="py-3 flex justify-between items-center">
            <div>
              <div className="font-medium text-[var(--text-primary)]">{tx.name}</div>
              <div className="text-xs text-[var(--text-secondary)]">{tx.date}</div>
            </div>
            <div className={`font-semibold ${tx.amount < 0 ? "text-red-500" : "text-green-600"}`}>
              {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
