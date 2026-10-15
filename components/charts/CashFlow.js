"use client";

import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import useIsDark from "@/lib/hooks/useIsDark";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

// Income vs expenses per month. `data` is [{ label, income, expense }].
export default function CashFlow({ data, format }) {
  const dark = useIsDark();
  const grid = dark ? "rgba(241,244,242,.06)" : "rgba(18,25,22,.06)";
  const tick = dark ? "#7B8880" : "#5A6660";

  return (
    <div className="h-64 w-full">
      <Bar
        data={{
          labels: data.map((d) => d.label),
          datasets: [
            { label: "Income", data: data.map((d) => d.income), backgroundColor: "#12B76A", borderRadius: 6, maxBarThickness: 22 },
            { label: "Expenses", data: data.map((d) => d.expense), backgroundColor: dark ? "#C8F250" : "#0E3B2E", borderRadius: 6, maxBarThickness: 22 },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          animation: { duration: 800, easing: "easeOutQuart" },
          interaction: { mode: "index", intersect: false },
          scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: { color: tick, font: { family: "Plus Jakarta Sans Variable", weight: "600" } } },
            y: {
              grid: { color: grid },
              border: { display: false },
              ticks: { color: tick, maxTicksLimit: 5, font: { family: "JetBrains Mono Variable", size: 11 }, callback: (v) => (format ? format(v) : v) },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#121916",
              padding: 10,
              cornerRadius: 10,
              boxPadding: 4,
              titleFont: { family: "Plus Jakarta Sans Variable", weight: "600" },
              bodyFont: { family: "JetBrains Mono Variable" },
              callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${format ? format(ctx.parsed.y) : ctx.parsed.y}` },
            },
          },
        }}
      />
    </div>
  );
}
