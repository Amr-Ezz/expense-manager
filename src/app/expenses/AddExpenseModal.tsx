// src/components/AddExpenseModal.tsx
"use client";

import { useState } from "react";

export default function AddExpenseModal({ onAdd }: { onAdd?: (payload:any) => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { amount: parseFloat(amount), category, description, date, id: Date.now() };
    onAdd?.(payload);
    setOpen(false);
    setAmount(""); setDescription("");
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition">+ Add Expense</button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 w-[min(95%,520px)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Expense</h3>
              <button onClick={() => setOpen(false)} className="text-[var(--text-secondary)]">✕</button>
            </div>
            <form onSubmit={submit} className="space-y-3">
              <input required placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full p-2 border rounded" type="number" step="0.01" />
              <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full p-2 border rounded">
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="shopping">Shopping</option>
                <option value="bills">Bills</option>
                <option value="other">Other</option>
              </select>
              <input required placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full p-2 border rounded" />
              <input required type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full p-2 border rounded" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-[var(--color-primary)] text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
