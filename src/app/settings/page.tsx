"use client";
import { getTheme, ThemeMode, useTheme } from "../../context/ThemeContext";
import { currencyOptions } from "../../context/CurrencyContext";
import { useCurrency } from "../../hooks/useCurrency";
import { useMemo, useState } from "react";
import { object } from "zod";
import { toast } from "react-toastify";

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
  const { currency: currentCurrency, setCurrency: setGlobalCurrency } =
    useCurrency();

  const [pendingMode, setPendingMode] = useState<ThemeMode>(currentMode);
  const [pendingCurrency, setPendingCurrency] = useState<string>(
    currentCurrency.code
  );
  const previewTheme = useMemo(() => getTheme(pendingMode), [pendingMode]);
  const hasChanges =
    pendingMode !== currentMode || pendingCurrency !== currentCurrency.code;
  const handleApply = async () => {
    const updates: any = {};
    if (pendingMode !== currentMode) updates.theme = pendingMode;
    if (pendingCurrency !== currentCurrency.code)
      updates.currency = pendingCurrency;

    if (Object.keys(updates).length === 0) return;

    try {
      // Update global contexts immediately
      if (updates.theme) setGlobalMode(pendingMode);
      if (updates.currency) setGlobalCurrency(pendingCurrency);

      // ✅ Save to backend (Prisma)
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: JSON.parse(localStorage.getItem("user")!)?.id,
          ...updates,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update settings");
      }

      const updatedSettings = await res.json();

      // ✅ Sync with localStorage + AuthContext
      const storedUser = JSON.parse(localStorage.getItem("user")!);
      const updatedUser = {
        ...storedUser,
        settings: { ...storedUser.settings, ...updatedSettings },
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Settings saved successfully 🎉");

    } catch (err) {
      console.error("🚨 Failed to update settings:", err);
    }
  };
  const handleCancel = () => {
    setPendingMode(currentMode);
    setPendingCurrency(currentCurrency.code);
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
              onChange={(e) => setPendingCurrency(e.target.value)}
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
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
