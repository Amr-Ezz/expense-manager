"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

import { Transaction } from "@/types";
import { TransactionsContextType } from "@/types";
import { defaultTransactions } from "@/app/utils/sampleData";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";

export const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] =
    useState<Transaction[]>(defaultTransactions);
  const { user } = useAuth();

  const fetchTransactions = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/transactions?userId=${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!user?.id) {
      console.error("No logged-in user to attach transaction to");
      return;
    }

    try {
      const res = await apiRequest("/api/transactions", {
        method: "POST",
        body: JSON.stringify({
          ...transaction,
          userId: user.id,
        }),
      });

      if (!res) throw new Error("Failed to create transaction");

      setTransactions((prev) => [res, ...prev]);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };
  const deleteTransaction = async (id: string) => {
    try {
      const res = await apiRequest(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      if (res?.error) throw new Error(res.error);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };
  const getExpenses = () => transactions.filter((t) => t.type === "expense");
  const getIncomes = () => transactions.filter((t) => t.type === "income");
  useEffect(() => {
    if (user?.id) fetchTransactions();
    else setTransactions([]);
  }, [user?.id]);

  // React.useEffect(() => {
  //   fetchTransactions();
  // }, [user]);

  // React.useEffect(() => {
  //   const storedTransactions = localStorage.getItem(
  //     `transactions_${currentUserId}`
  //   );
  //   if (storedTransactions) {
  //     setTransactions(JSON.parse(storedTransactions));
  //   } else {
  //     setTransactions(defaultTransactions);
  //   }
  // }, [currentUserId]);

  // React.useEffect(() => {
  //   localStorage.setItem(
  //     `transactions_${currentUserId}`,
  //     JSON.stringify(transactions)
  //   );
  // }, [transactions, currentUserId]);
  ///////////////////////////////////////////

  // const addTransaction = (transaction: Omit<Transaction, "id">) => {
  //   const newTransaction = {
  //     ...transaction,
  //     id: uuidv4(),
  //   };
  //   setTransactions((prev) => [...prev, newTransaction]);
  // };

  //   const getExpenses = () => transactions.filter((t) => t.type === "expense");
  //   const getIncomes = () => transactions.filter((t) => t.type === "income");
  //   ////////////////////////////////////////////////////////
  //   const deleteTransaction = (id: string) => {
  //     setTransactions((prev) => prev.filter((t) => t.id !== id));
  //   };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        getExpenses,
        getIncomes,
        deleteTransaction,
        fetchTransactions
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};


