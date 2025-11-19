"use client";
import { CurrencyChangeConfirmationProps } from "@/types";
import React from "react";



const CurrencyChangeConfirmation: React.FC<CurrencyChangeConfirmationProps> = ({
  isOpen,
  currentCurrency,
  newCurrency,
  transactionCount,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-[90%] max-w-md border border-gray-200 dark:border-gray-700">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
            <svg
              className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-3 text-center text-gray-800 dark:text-gray-100">
          Change Preferred Currency?
        </h2>

        {/* Message */}
        <div className="mb-6 text-gray-600 dark:text-gray-300">
          <p className="mb-3">
            You are about to change your preferred currency from{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {currentCurrency}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {newCurrency}
            </span>
            .
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              ⚠️ This will affect {transactionCount} transaction{transactionCount !== 1 ? "s" : ""}
            </p>
          </div>

          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>All transactions will be recalculated to {newCurrency}</li>
            <li>Original currency amounts will be preserved</li>
            <li>Exchange rates will be fetched automatically</li>
            <li>You can change back at any time</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition font-medium"
          >
            Change Currency
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyChangeConfirmation;  