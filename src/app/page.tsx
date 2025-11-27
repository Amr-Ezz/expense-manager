"use client";
import ChartsArea from "./components/ChartsCard";
import RecentTransactions from "./components/RecentTransactions";
import DashboardStats from "./components/DashboardStats";

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-6">
      <div className="">
       <DashboardStats />
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        <ChartsArea />
      </div>

      <RecentTransactions   />
    </main>
  );
}
