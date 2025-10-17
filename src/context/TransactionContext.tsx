"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

import { Transaction } from "@/types";
import { TransactionsContextType } from "@/types";
import { defaultTransactions } from "@/app/utils/sampleData";
 import { v4 as uuidv4 } from "uuid";


interface ExtendedTransactionsContextType extends TransactionsContextType {
  deleteTransaction: (id: string) => void;
}

const TransactionsContext = createContext<
  ExtendedTransactionsContextType | undefined
>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [currentUserId, setCurrentUserId] = useState<string>("user_123"); // Simulated user ID

  React.useEffect(() => {
    const storedTransactions = localStorage.getItem(
      `transactions_${currentUserId}`
    );
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      setTransactions(defaultTransactions);
    }
  }, [currentUserId]);

  React.useEffect(() => {
    localStorage.setItem(
      `transactions_${currentUserId}`,
      JSON.stringify(transactions)
    );
  }, [transactions, currentUserId]);
  ///////////////////////////////////////////


const addTransaction = (transaction: Omit<Transaction, "id">) => {
  const newTransaction = {
    ...transaction,
    id: uuidv4(),
  };
  setTransactions((prev) => [...prev, newTransaction]);
};

  const getExpenses = () => transactions.filter((t) => t.type === "expense");
  const getIncomes = () => transactions.filter((t) => t.type === "income");
  ////////////////////////////////////////////////////////
  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        getExpenses,
        getIncomes,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions must be used within TransactionsProvider");
  }
  return context;
};
