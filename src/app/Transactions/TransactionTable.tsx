"use client";

import React from "react";

import { Transaction } from "@/types";

import { TransactionsContextType } from "@/types";
import { defaultTransactions } from "../utils/sampleData";
import { useTransactions } from "@/context/TransactionContext";
import { useCurrency } from "@/context/CurrencyContext";



const TransactionsTable: React.FC<TransactionsContextType> = () => {
  const { transactions = defaultTransactions } = useTransactions();
  const {currency} = useCurrency();
  return (
      <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl shadow-md  text-white">
      <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="p-2">Description</th>
            <th className="p-2">Category</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Type</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b border-gray-800 hover:bg-[#2A2A2A] transition">
              <td className="p-2">{t.description}</td>
              <td className="p-2">{t.category}</td>
              <td className={`p-2 ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                {t.type === "income" ? "+" : "-"}{currency.symbol}{Math.abs(t.amount).toFixed(2)}
              </td>
              <td className="p-2 capitalize">{t.type}</td>
              <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {transactions.length === 0 && <p className="text-gray-400 mt-2">No transactions yet.</p>}
    </div>
  );
};

export default TransactionsTable;
