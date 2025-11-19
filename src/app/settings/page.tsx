"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransaction";
import CurrencyChangeConfirmation from "@/app/components/CurrencyChangeConfirmation";

const SettingsPage = () => {
  const { user } = useAuth();
  const { transactions } = useTransactions();
  const [pendingCurrency, setPendingCurrency] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCurrencyChange = (newCurrency: string) => {
    const currentCurrency = user?.settings?.currency || "USD";
    
    // If currency is actually changing, show confirmation
    if (newCurrency !== currentCurrency && transactions.length > 0) {
      setPendingCurrency(newCurrency);
      setShowConfirmation(true);
    } else {
      // No transactions or same currency, just update
      saveCurrencyChange(newCurrency);
    }
  };

  const saveCurrencyChange = async (newCurrency: string) => {
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          currency: newCurrency,
        }),
      });

      if (!response.ok) throw new Error("Failed to update currency");

      // Update will trigger recalculation in TransactionsContext
      window.location.reload(); // Or use your state management to update user
    } catch (error) {
      console.error("Error updating currency:", error);
      alert("Failed to update currency");
    }
  };

  const handleConfirmCurrencyChange = () => {
    if (pendingCurrency) {
      saveCurrencyChange(pendingCurrency);
    }
    setShowConfirmation(false);
    setPendingCurrency(null);
  };

  const handleCancelCurrencyChange = () => {
    setShowConfirmation(false);
    setPendingCurrency(null);
  };

  return (
    <>
      {/* Your settings UI */}
      <select
        value={user?.settings?.currency || "USD"}
        onChange={(e) => handleCurrencyChange(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
        <option value="EGP">EGP</option>
        {/* Add more currencies */}
      </select>

      {/* Confirmation Dialog */}
      <CurrencyChangeConfirmation
        isOpen={showConfirmation}
        currentCurrency={user?.settings?.currency || "USD"}
        newCurrency={pendingCurrency || "USD"}
        transactionCount={transactions.length}
        onConfirm={handleConfirmCurrencyChange}
        onCancel={handleCancelCurrencyChange}
      />
    </>
  );
};