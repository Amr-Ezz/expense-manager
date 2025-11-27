"use client";
import { useEffect, useRef, useMemo } from "react";
import Chart from "chart.js/auto";
import { useTheme } from "@/context/ThemeContext";
import { useTransactions } from "@/hooks/useTransaction";
import { useCurrency } from "@/hooks/useCurrency";

export default function ChartsArea() {
  const lineRef = useRef<HTMLCanvasElement | null>(null);
  const doughnutRef = useRef<HTMLCanvasElement | null>(null);
  const lineInstance = useRef<Chart | null>(null);
  const doughnutInstance = useRef<Chart | null>(null);
  
  const { theme } = useTheme();
  const { transactions, loading } = useTransactions();
  const { currency } = useCurrency();

  // Calculate line chart data (Monthly Income vs Expenses for last 6 months)
  const lineChartData = useMemo(() => {
    if (transactions.length === 0) {
      return null;
    }

    // Get last 6 months
    const months: {
      label: string;
      month: number;
      year: number;
      income: number;
      expenses: number;
    }[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: date.toLocaleDateString('en-US', { month: 'short' }),
        month: date.getMonth(),
        year: date.getFullYear(),
        income: 0,
        expenses: 0,
      });
    }

    // Calculate income and expenses for each month
    transactions.forEach((tx) => {
      const txDate = new Date(tx.date);
      const monthData = months.find(
        (m) => m.month === txDate.getMonth() && m.year === txDate.getFullYear()
      );

      if (monthData) {
        const amount = tx.convertedAmount ?? tx.amount;
        if (tx.type === "income") {
          monthData.income += amount;
        } else {
          monthData.expenses += amount;
        }
      }
    });

    return {
      labels: months.map((m) => m.label),
      datasets: [
        {
          label: "Income",
          data: months.map((m) => m.income),
          borderColor: "rgb(34, 197, 94)", // green-500
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Expenses",
          data: months.map((m) => m.expenses),
          borderColor: "rgb(239, 68, 68)", // red-500
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [transactions]);

  // Calculate doughnut chart data (Category breakdown for current month)
  const doughnutChartData = useMemo(() => {
    if (transactions.length === 0) {
      return null;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter current month's expenses
    const currentMonthExpenses = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return (
        tx.type === "expense" &&
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear
      );
    });

    if (currentMonthExpenses.length === 0) {
      return null;
    }

    // Group by category
    const categoryTotals: { [key: string]: number } = {};
    
    currentMonthExpenses.forEach((tx) => {
      const amount = tx.convertedAmount ?? tx.amount;
      if (categoryTotals[tx.category]) {
        categoryTotals[tx.category] += amount;
      } else {
        categoryTotals[tx.category] = amount;
      }
    });

    // Sort categories by amount (highest first) and take top 5
    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Generate colors
    const colors = [
      "rgb(59, 130, 246)",   // blue-500
      "rgb(239, 68, 68)",    // red-500
      "rgb(34, 197, 94)",    // green-500
      "rgb(251, 191, 36)",   // amber-500
      "rgb(168, 85, 247)",   // purple-500
    ];

    return {
      labels: sortedCategories.map(([category]) => category),
      datasets: [
        {
          data: sortedCategories.map(([, amount]) => amount),
          backgroundColor: colors.slice(0, sortedCategories.length),
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    };
  }, [transactions]);

  useEffect(() => {
    if (loading) return;

    // Line Chart
    if (lineRef.current && lineChartData) {
      if (lineInstance.current) {
        lineInstance.current.destroy();
      }

      lineInstance.current = new Chart(lineRef.current, {
        type: "line",
        data: lineChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: "#ffffff",
                usePointStyle: true,
                padding: 15,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  label += currency.symbol + context.parsed.y.toFixed(2);
                  return label;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: "#ffffff",
                callback: function (value) {
                  return currency.symbol + value;
                },
              },
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
            },
            x: {
              ticks: {
                color: "#ffffff",
              },
              grid: {
                display: false,
              },
            },
          },
        },
      });
    }

    // Doughnut Chart
    if (doughnutRef.current && doughnutChartData) {
      if (doughnutInstance.current) {
        doughnutInstance.current.destroy();
      }

      doughnutInstance.current = new Chart(doughnutRef.current, {
        type: "doughnut",
        data: doughnutChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#ffffff",
                padding: 15,
                usePointStyle: true,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.parsed;
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${currency.symbol}${value.toFixed(2)} (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (lineInstance.current) {
        lineInstance.current.destroy();
      }
      if (doughnutInstance.current) {
        doughnutInstance.current.destroy();
      }
    };
  }, [lineChartData, doughnutChartData, theme, currency, loading]);

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Line Chart Skeleton */}
        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm h-72">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
            <div className="h-56 bg-gray-100 text-white dark:bg-gray-800 rounded"></div>
          </div>
        </div>

        {/* Doughnut Chart Skeleton */}
        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm h-72">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
            <div className="h-56 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto" style={{ width: "224px" }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!lineChartData && !doughnutChartData) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm h-72 flex items-center justify-center">
          <div className="text-center text-white">
            <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>No transaction data yet</p>
            <p className="text-sm mt-1">Add transactions to see trends</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm h-72 flex items-center justify-center">
          <div className="text-center text-white">
            <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            <p>No expense data yet</p>
            <p className="text-sm mt-1">Add expenses to see breakdown</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Line Chart */}
      <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm h-96 flex flex-col">
        <h3 className="text-lg font-semibold mb-3 text-white shrink-0">
          Income vs Expenses (Last 6 Months)
        </h3>
        <div className="flex-grow min-h-0">
          {lineChartData ? (
            <canvas ref={lineRef}></canvas>
          ) : (
            <div className="h-full flex items-center justify-center text-white">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Doughnut Chart */}
      <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm h-96 flex flex-col">
        <h3 className="text-lg font-semibold mb-3 text-white shrink-0">
          Expense Breakdown (This Month)
        </h3>
        <div className="flex-grow min-h-0 flex items-center justify-center relative">
          {doughnutChartData ? (
            <canvas ref={doughnutRef} style={{ maxWidth: "100%", maxHeight: "100%" }}></canvas>
          ) : (
            <div className="text-center text-white">
              No expenses this month
            </div>
          )}
        </div>
      </div>
    </div>
  );
}