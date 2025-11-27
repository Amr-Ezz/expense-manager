"use client";
import { getTheme, ThemeMode, useTheme } from "../../context/ThemeContext";
import { currencyOptions } from "../../lib/currency";
import { useCurrency } from "../../hooks/useCurrency";
import { useAuth } from "../../hooks/useAuth";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useTransactions } from "@/hooks/useTransaction";
import CurrencyChangeConfirmation from "@/app/components/CurrencyChangeConfirmation";

const SettingsPage = () => {
  const themeContext = useTheme();
  if (!themeContext) {
    throw new Error(
      "ThemeContext is undefined. Make sure your component is wrapped in ThemeProvider."
    );
  }
  
  const {
    theme: currentTheme,
    mode: currentMode,
    setMode: setGlobalMode,
  } = themeContext;
  
  const { currency: currentCurrency, setCurrency: setGlobalCurrency } = useCurrency();
  const { user } = useAuth();
  const { transactions } = useTransactions();

  const [pendingMode, setPendingMode] = useState<ThemeMode>(currentMode);
  const [pendingCurrency, setPendingCurrency] = useState<string>(currentCurrency.code);
  const [showCurrencyConfirmation, setShowCurrencyConfirmation] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const previewTheme = useMemo(() => getTheme(pendingMode), [pendingMode]);
  
  const hasChanges =
    pendingMode !== currentMode || pendingCurrency !== currentCurrency.code;

  const handleApply = async () => {
    // Check if user is logged in
    if (!user?.id) {
      setShowAuthPrompt(true);
      toast.error("Please sign in to save settings");
      return;
    }

    const updates: any = {};
    if (pendingMode !== currentMode) updates.theme = pendingMode;
    if (pendingCurrency !== currentCurrency.code) {
      // Show confirmation if currency is changing and there are transactions
      if (transactions.length > 0) {
        setShowCurrencyConfirmation(true);
        return;
      }
      updates.currency = pendingCurrency;
    }

    if (Object.keys(updates).length === 0) return;

    await saveSettings(updates);
  };

  const saveSettings = async (updates: any) => {
    try {
      // Update global contexts immediately
      if (updates.theme) setGlobalMode(pendingMode);
      if (updates.currency) setGlobalCurrency(pendingCurrency);

      // Save to backend (Prisma)
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user!.id,
          ...updates,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update settings");
      }

      const updatedSettings = await res.json();

      // Sync with localStorage + AuthContext
      const storedUserStr = localStorage.getItem("user");
      if (storedUserStr) {
        const storedUser = JSON.parse(storedUserStr);
        const updatedUser = {
          ...storedUser,
          settings: { ...storedUser.settings, ...updatedSettings },
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      
      toast.success("Settings saved successfully 🎉");
    } catch (err) {
      console.error("🚨 Failed to update settings:", err);
      toast.error("Failed to update settings");
    }
  };

  const handleConfirmCurrencyChange = async () => {
    setShowCurrencyConfirmation(false);
    await saveSettings({ currency: pendingCurrency });
  };

  const handleCancelCurrencyChange = () => {
    setShowCurrencyConfirmation(false);
    setPendingCurrency(currentCurrency.code);
  };

  const handleCancel = () => {
    setPendingMode(currentMode);
    setPendingCurrency(currentCurrency.code);
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setPendingCurrency(newCurrency);
  };

  return (
    <div className="p-6">
      <div
        className="max-w-3xl mx-auto rounded-2xl p-6"
        style={{
          background: currentTheme.primary,
          color: currentTheme.text,
          border: `1px solid ${currentTheme.accent}`,
        }}
      >
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>

        {/* Auth Prompt Banner */}
        {!user && showAuthPrompt && (
          <div className="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">
                  Sign In Required
                </h3>
                <p className="text-sm text-red-900 dark:text-red-400 mb-3">
                  You need to be signed in to save your settings. Your preferences will be stored securely and synced across devices.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // Trigger login modal from navbar
                      const event = new CustomEvent('openAuthModal', { detail: 'login' });
                      window.dispatchEvent(event);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      // Trigger register modal from navbar
                      const event = new CustomEvent('openAuthModal', { detail: 'register' });
                      window.dispatchEvent(event);
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => setShowAuthPrompt(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-medium">Theme</h2>
              <p className="text-sm opacity-80">
                Choose app appearance (light/dark)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPendingMode("light")}
                className={`px-3 py-2 rounded-md border ${
                  pendingMode === "light" ? "ring-2 ring-offset-1" : ""
                }`}
                style={{
                  background: pendingMode === "light" ? "#fff" : "transparent",
                }}
              >
                Light
              </button>

              <button
                onClick={() => setPendingMode("dark")}
                className={`px-3 py-2 rounded-md border ${
                  pendingMode === "dark" ? "ring-2 ring-offset-1" : ""
                }`}
                style={{
                  background:
                    pendingMode === "dark"
                      ? previewTheme.secondary
                      : "transparent",
                  color: pendingMode === "dark" ? previewTheme.text : undefined,
                }}
              >
                Dark
              </button>
            </div>
          </div>

          <div
            className="rounded-lg p-4 mt-3"
            style={{
              background: previewTheme.secondary,
              color: previewTheme.text,
              border: `1px solid ${previewTheme.accent}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Preview Title</div>
                <div className="text-sm opacity-80">
                  This is how your UI will look
                </div>
              </div>
              <div
                className="px-3 py-1 rounded-full"
                style={{
                  background: previewTheme.accent,
                  color: previewTheme.highlight,
                }}
              >
                CTA
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-medium">Currency</h2>
              <p className="text-sm opacity-80">
                Choose default currency for new transactions
              </p>
            </div>
            <select
              value={pendingCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="p-2 rounded-lg border"
              style={{
                background: previewTheme.primary,
                color: previewTheme.text,
                borderColor: previewTheme.accent,
              }}
            >
              {currencyOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </section>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-md border"
            style={{
              background: currentTheme.primary,
              color: currentTheme.text,
              borderColor: currentTheme.accent,
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded-md ${
              hasChanges ? "shadow-md" : "opacity-50 cursor-not-allowed"
            }`}
            style={{
              background: previewTheme.accent,
              color: previewTheme.highlight,
              border: `1px solid ${previewTheme.accent}`,
            }}
          >
            {user ? "Apply" : "Sign In to Save"}
          </button>
        </div>
      </div>

      {/* Currency Change Confirmation */}
      <CurrencyChangeConfirmation
        isOpen={showCurrencyConfirmation}
        currentCurrency={currentCurrency.code}
        newCurrency={pendingCurrency}
        transactionCount={transactions.length}
        onConfirm={handleConfirmCurrencyChange}
        onCancel={handleCancelCurrencyChange}
      />
    </div>
  );
};

export default SettingsPage;