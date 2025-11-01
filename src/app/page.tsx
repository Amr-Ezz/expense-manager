"use client";
import StatsCard from "./components/StatsCard";
import ChartsArea from "./components/ChartsCard";
import RecentTransactions from "./components/RecentTransactions";
import { useCurrency } from "@/hooks/useCurrency";

export default function DashboardPage() {
  const {currency} = useCurrency();
  return (
    <main className="pt-20 px-6 max-w-7xl mx-auto space-y-8">
      {/* Stats cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard title="Total Balance" value={`${currency.symbol} 1,200`} />
        <StatsCard title="Monthly Expenses" value={`${currency.symbol} 450`} />
        <StatsCard title="Savings" value={`${currency.symbol} 750`} />
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartsArea />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </main>
  );
}
