"use client";

import React from "react";
import { useTransactions } from "@/context/TransactionContext";
import { useCurrency } from "@/context/CurrencyContext";

const ExpenseTable: React.FC = () => {
  const { getExpenses } = useTransactions();
  const {currency} = useCurrency();

  const expenses = typeof getExpenses === "function" ? getExpenses() : [];

  return (
    <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl shadow-md  text-white">
      <h2 className="text-xl font-semibold mb-4">Expenses</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="p-2">Description</th>
            <th className="p-2">Category</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} className="border-b border-gray-800 hover:bg-[#2A2A2A] transition">
              <td className="p-2">{e.description}</td>
              <td className="p-2">{e.category}</td>
              <td className="p-2 text-red-400">- {currency.symbol}{e.amount.toFixed(2)}</td>
              <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {expenses.length === 0 && <p className="text-gray-400 mt-2">No expenses yet.</p>}
    </div>
  );
};

export default ExpenseTable;
