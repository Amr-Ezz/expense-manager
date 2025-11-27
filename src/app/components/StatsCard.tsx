"use client";
import { useTheme } from "@/context/ThemeContext";

interface StatsCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  trend,
  loading = false 
}: StatsCardProps) {
  const { theme } = useTheme();

  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      {loading ? (
        // Loading State
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      ) : (
        <>
          {/* Header with Icon */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </div>
            {icon && (
              <div className="text-gray-400 dark:text-gray-500">
                {icon}
              </div>
            )}
          </div>

          {/* Value */}
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </div>

            {/* Trend Indicator */}
            {trend && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                trend.isPositive 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-red-600 dark:text-red-400"
              }`}>
                <svg
                  className={`w-4 h-4 ${trend.isPositive ? "" : "rotate-180"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}