"use client";
import { useTransactions } from "@/context/TransactionContext";
import { useState } from "react";

import { AddExpenseModalProps } from "@/types";

export default function AddExpenseModal({ onClose, isOpen }: AddExpenseModalProps) {
  // const [form, setForm] = useState({
  //   title: "",
  //   amount: "",
  //   category: "",
  //   date: "",
  // });

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("New Transaction:", form);
  //   onClose();
  // };
  const { addTransaction } = useTransactions();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<"income" | "expense">("income");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !title) return;

    addTransaction({
      description: title,
      id: Date.now().toLocaleString(),
      amount: Number(amount),
      category,
      type: 'expense',
      date: new Date().toLocaleDateString(),

    });
    setTitle("");
    setCategory("");
    setAmount("");
  
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-primary)]">
          Add Expense
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
            required
          />
               <input
            name="category"
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
            required
          />
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-2 border border-gray-200 rounded-md"
            required
          />
        
     

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
