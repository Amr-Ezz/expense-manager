"use client";
import { useState } from "react";
import AddExpenseModal from "../components/Modal/AddExpenseModal";
import ExpenseTable from "./ExpenseTable";
import { useTransactions } from "@/hooks/useTransaction";
import Button from "../components/ui/button";

export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="px-8 py-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-[var(--color-primary)]">
          Expenses
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)] transition"
        >
          + Add Expense 
        </button>
      </div>

      <ExpenseTable  />

      {isModalOpen && <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
