"use client";
import { useMemo } from "react";
import { useTransactions } from "@/hooks/useTransaction";
import { useCurrency } from "@/hooks/useCurrency";
import StatsCard from "./StatsCard";

export default function DashboardStats() {
  const { transactions, loading } = useTransactions();
  const { currency } = useCurrency();

  const stats = useMemo(() => {
    if (transactions.length === 0) {
      return {
        totalBalance: 0,
        monthlyExpenses: 0,
        monthlyIncome: 0,
        savings: 0,
      };
    }

    // Get current month/year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter transactions for current month
    const currentMonthTransactions = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return (
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear
      );
    });

    // Calculate monthly income and expenses
    const monthlyIncome = currentMonthTransactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + (tx.convertedAmount ?? tx.amount), 0);

    const monthlyExpenses = currentMonthTransactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + (tx.convertedAmount ?? tx.amount), 0);

    // Calculate total balance (all time income - expenses)
    const totalIncome = transactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + (tx.convertedAmount ?? tx.amount), 0);

    const totalExpenses = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + (tx.convertedAmount ?? tx.amount), 0);

    const totalBalance = totalIncome - totalExpenses;

    // Savings = Monthly Income - Monthly Expenses
    const savings = monthlyIncome - monthlyExpenses;

    return {
      totalBalance,
      monthlyExpenses,
      monthlyIncome,
      savings,
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return `${currency.symbol}${Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Balance */}
      <StatsCard
        title="Total Balance"
        value={formatCurrency(stats.totalBalance)}
        loading={loading}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />

      {/* Monthly Income */}
      <StatsCard
        title="Monthly Income"
        value={formatCurrency(stats.monthlyIncome)}
        loading={loading}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        }
      />

      {/* Monthly Expenses */}
      <StatsCard
        title="Monthly Expenses"
        value={formatCurrency(stats.monthlyExpenses)}
        loading={loading}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
            />
          </svg>
        }
      />

      {/* Savings */}
      <StatsCard
        title="Savings (This Month)"
        value={formatCurrency(stats.savings)}
        loading={loading}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
      />
    </div>
  );
}