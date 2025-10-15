"use client";
import React, { useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import { title } from "process";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addTransaction } = useTransactions();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount || !date) return;

    addTransaction({
      description: title,
      type: type.toLowerCase() as "income" | "expense",
      category,
      amount: parseFloat(amount),
      date,
      id: ""
    });
setTitle("");
    setCategory("");
    setAmount("");
    setDate("");
    onClose();
  };

  return (
    <div className="fixed inset-0  bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
          Add
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100"
          >
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
            <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100"
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100"
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
