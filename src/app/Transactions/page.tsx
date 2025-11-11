// src/app/transactions/page.tsx
"use client";

import React, { useState } from "react";
import { useTransactions } from "@/hooks/useTransaction";
import TransactionsTable from "./TransactionTable";
import AddTransactionModal from "../../app/components/Modal/AddTransactionModal";
import Button  from "../components/ui/button";
import  { Transaction } from "../../types";
import ExpenseTable from "../expenses/ExpenseTable";



const TransactionsPage: React.FC = () => {
  const { transactions } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
  <h1 className="text-3xl font-semibold text-[var(--color-primary)]">
          Transactions
        </h1>        <Button onClick={handleOpenModal}>Add Transaction</Button>
      </div>

      {/* Transaction Table */}
      <TransactionsTable transactions={transactions} />

      {/* Add Transaction Modal */}
      {isModalOpen && <AddTransactionModal isOpen={isModalOpen} onClose={handleCloseModal} />}
    </div>
  );
};

export default TransactionsPage;
