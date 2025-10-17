"use client";
import { useTheme } from "../../context/ThemeContext";
import { useCurrency } from "../../context/CurrencyContext";

const SettingsPage = () => {
  const themeContext = useTheme();
  if (!themeContext) {
    throw new Error("ThemeContext is undefined. Make sure your component is wrapped in ThemeProvider.");
  }
  const { theme, mode, toggleTheme } = themeContext;
  const { currency, setCurrency } = useCurrency();

  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "EGP", symbol: "£" },
    { code: "GBP", symbol: "£" },
  ];

  return (
    <div
      style={{
        backgroundColor: theme.background,
        color: theme.text,
      }}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div
        style={{
          backgroundColor: theme.secondary,
          color: theme.text,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          border: `1px solid ${theme.accent}`,
        }}
        className="w-full max-w-3xl rounded-2xl p-8 space-y-10"
      >
        <h1 className="text-3xl font-semibold text-center mb-6">
          ⚙️ App Settings
        </h1>

        <div className="space-y-3">
          <h2 className="text-xl font-medium">Theme</h2>
          <p className="opacity-80">
            Choose between light or dark mode for your interface.
          </p>
          <button
            onClick={toggleTheme}
            style={{
              backgroundColor: theme.accent,
              color: theme.highlight,
            }}
            className="px-5 py-2 rounded-xl transition hover:opacity-90"
          >
            Switch to {mode === "light" ? "Dark" : "Light"} Mode
          </button>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-medium">Currency</h2>
          <p className="opacity-80">
            Select your preferred currency for transactions.
          </p>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              backgroundColor: theme.primary,
              color: theme.text,
              border: `1px solid ${theme.accent}`,
            }}
            className="w-full p-3 rounded-xl outline-none"
          >
            {currencies.map((cur) => (
              <option key={cur.code} value={cur.code}>
                {cur.code} ({cur.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-4 gap-4 pt-8 align-center justify-between">
       
          <div
            style={{ backgroundColor: theme.secondary }}
            className="rounded-xl p-4 text-center"
          >
            Apply
          </div>
          <div
            style={{ backgroundColor: theme.accent }}
            className="rounded-xl p-4 text-center"
          >
            Cancel
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
