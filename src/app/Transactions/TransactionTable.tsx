"use client";

import React from "react";
import { useTransactions } from "@/hooks/useTransaction";
import { useCurrency } from "@/hooks/useCurrency";

const TransactionsTable: React.FC = () => {
  const { transactions, loading } = useTransactions();
  const { currency } = useCurrency();

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl shadow-md text-white">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3">Updating amounts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl shadow-md text-white">
      <h2 className="text-xl font-semibold mb-4">All Transactions</h2>

      <div className="overflow-x-auto">
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
            {transactions.map((t) => {
              const displayAmount = t.convertedAmount ?? t.amount;
              const isConverted = t.currency !== t.convertedCurrency;

              return (
                <tr key={t.id} className="border-b border-gray-800 hover:bg-[#2A2A2A] transition">
                  <td className="p-2">{t.description}</td>
                  <td className="p-2">{t.category}</td>

                  <td className={`p-2 ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {t.type === "income" ? "+" : "-"}
                        {currency.symbol}
                        {Math.abs(displayAmount).toFixed(2)}
                      </span>
                      
                      {/* Show original amount if converted */}
                      {isConverted && (
                        <span className="text-xs text-gray-400 mt-1">
                          ({t.amount.toFixed(2)} {t.currency} → {t.convertedCurrency})
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-2 capitalize">{t.type}</td>
                  <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <p className="text-gray-400 mt-4 text-center">No transactions yet.</p>
      )}
    </div>
  );
};

export default TransactionsTable;