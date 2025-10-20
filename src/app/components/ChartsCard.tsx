// src/components/ChartsArea.tsx
"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useTheme } from "@/context/ThemeContext";

export default function ChartsArea({ lineData, doughnutData }: { lineData?: any; doughnutData?: any }) {
  const lineRef = useRef<HTMLCanvasElement | null>(null);
  const barRef = useRef<HTMLCanvasElement | null>(null);
  const doughnutRef = useRef<HTMLCanvasElement | null>(null);
  const lineInstance = useRef<any>(null);
  const doughnutInstance = useRef<any>(null);

  const {theme} = useTheme();

  useEffect(() => {
    const sampleLine = lineData ?? {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [{
          label: "Revenue",
          data: [400, 320, 460, 520, 610],
          fill: false,
          borderColor: "var(--color-primary)",
          tension: 0.3
      }]
    };

    const sampleDoughnut = doughnutData ?? {
      labels: ["Food", "Transport", "Bills"],
      datasets: [{
        data: [120, 80, 200],
        backgroundColor: ["#FAEAB1", "#34656D", "#334443"]
      }]
    };

    if (lineRef.current) {
      if (lineInstance.current) lineInstance.current.destroy();
      lineInstance.current = new Chart(lineRef.current, {
        type: "line",
        data: sampleLine,
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
      });
    }

    if (doughnutRef.current) {
      if (doughnutInstance.current) doughnutInstance.current.destroy();
      doughnutInstance.current = new Chart(doughnutRef.current, {
        type: "doughnut",
        data: sampleDoughnut,
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
      });
    }

    return () => {
      if (lineInstance.current) lineInstance.current.destroy();
      if (doughnutInstance.current) doughnutInstance.current.destroy();
    };
  }, [lineData, doughnutData]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={`bg-${theme.primary} p-4 rounded-2xl border border-[var(--border)] shadow-sm h-72`}>
        <h3 className={`text-lg font-semibold mb-3 text-`}>Data Trends</h3>
        <div className="h-56">
          <canvas ref={lineRef}></canvas>
        </div>
      </div>

      <div className={`bg-${theme.secondary} p-4 rounded-2xl border border-[var(--border)] shadow-sm h-72`}>
        <h3 className={`text-lg font-semibold mb-3 text-${theme.text}`}>Category Breakdown</h3>
        <div className="h-56 flex items-center justify-center">
          <canvas ref={doughnutRef} style={{ width: "100%", height: "100%" }}></canvas>
        </div>
      </div>
    </div>
  );
}
