"use client";
import { useCurrency } from "@/hooks/useCurrency";
import { useTheme } from "@/context/ThemeContext";
import { useTransactions } from "@/hooks/useTransaction";
import Link from "next/link";

export default function RecentTransactions() {
  const { theme } = useTheme();
  const { currency } = useCurrency();
  const { transactions, loading } = useTransactions();

  // Get the last 3 transactions
  const recentTransactions = transactions.slice(0, 3);

  return (
    <div
      className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Recent Transactions
        </h3>
        <Link
          href="/Transactions"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mb-2"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading transactions...</p>
        </div>
      ) : recentTransactions.length === 0 ? (
        /* Empty State */
        <div className="py-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 mb-2">No transactions yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Add your first transaction to get started
          </p>
        </div>
      ) : (
        /* Transactions List */
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentTransactions.map((tx) => {
            const displayAmount = tx.convertedAmount ?? tx.amount;
            const isConverted = tx.currency !== tx.convertedCurrency;

            return (
              <li key={tx.id} className="py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition rounded-lg px-2">
                <div className="flex-1">
                  <div className="font-medium text-gray-800 dark:text-white">
                    {tx.description}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(tx.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {tx.category}
                    </span>
                    {isConverted && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        ({tx.currency})
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={`font-semibold text-lg ${
                    tx.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {currency.symbol}
                  {Math.abs(displayAmount).toFixed(2)}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}