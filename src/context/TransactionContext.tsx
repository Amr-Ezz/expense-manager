"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { Transaction } from "@/types";
import { TransactionsContextType } from "@/types";
import { defaultTransactions } from "@/app/utils/sampleData";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";

export const TransactionsContext = createContext<
  TransactionsContextType | undefined
>(undefined);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Track if we've done initial recalculation
  const hasRecalculated = useRef(false);
  const previousCurrency = useRef<string | undefined>(undefined);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/transactions?userId=${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const recalculateTransactions = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await apiRequest("/api/transactions/recalculate", {
        method: "POST",
        body: JSON.stringify({ userId: user.id }),
      });
      console.log("✅ Recalculation complete");
    } catch (error) {
      console.error("Error recalculating transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
          // Store the current user's currency with the transaction
          currency: transaction.currency || user.settings?.currency || "USD",
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

  // Initial fetch when user logs in
  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
    } else {
      setTransactions([]);
      hasRecalculated.current = false;
      previousCurrency.current = undefined;
    }
  }, [user?.id, fetchTransactions]);

  // Handle currency changes - recalculate and refetch
  useEffect(() => {
    const currentCurrency = user?.settings?.currency;
    
    // Skip if no user or no currency set
    if (!user?.id || !currentCurrency) {
      return;
    }

    // Check if currency actually changed
    const currencyChanged = previousCurrency.current !== undefined && 
                           previousCurrency.current !== currentCurrency;

    // Update the ref
    previousCurrency.current = currentCurrency;

    // If currency changed, recalculate (only once, not multiple times)
    if (currencyChanged && !loading) {
      console.log(`💱 Currency changed to ${currentCurrency}, recalculating...`);
      setLoading(true);
      
      const handleCurrencyChange = async () => {
        try {
          await recalculateTransactions();
          await fetchTransactions();
        } catch (error) {
          console.error("Error handling currency change:", error);
        } finally {
          setLoading(false);
        }
      };
      
      handleCurrencyChange();
    }
  }, [user?.settings?.currency, user?.id]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        getExpenses,
        getIncomes,
        deleteTransaction,
        fetchTransactions,
        recalculateTransactions,
        loading,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};