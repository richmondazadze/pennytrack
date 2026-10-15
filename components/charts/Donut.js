"use client";

import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

// Category doughnut with a label in the hole. `data` is [{ title, color, total }].
export default function Donut({ data, centerValue, centerLabel, format }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[240px]">
      <Doughnut
        data={{
          labels: data.map((d) => d.title),
          datasets: [
            {
              data: data.map((d) => d.total),
              backgroundColor: data.map((d) => d.color),
              borderColor: "rgba(0,0,0,0)",
              borderWidth: 0,
              spacing: data.length > 1 ? 3 : 0,
              borderRadius: 4,
              hoverOffset: 6,
            },
          ],
        }}
        options={{
          cutout: "74%",
          maintainAspectRatio: true,
          layout: { padding: 6 },
          animation: { animateRotate: true, duration: 900, easing: "easeOutQuart" },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#121916",
              padding: 10,
              cornerRadius: 10,
              displayColors: true,
              boxPadding: 4,
              titleFont: { family: "Plus Jakarta Sans Variable", weight: "600" },
              bodyFont: { family: "JetBrains Mono Variable" },
              callbacks: { label: (ctx) => ` ${format ? format(ctx.parsed) : ctx.parsed}` },
            },
          },
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="figure text-[22px] font-semibold leading-tight">{centerValue}</span>
        {centerLabel && <span className="mt-0.5 text-xs text-muted">{centerLabel}</span>}
      </div>
    </div>
  );
}

// Legend grid with percentages, as in the design system.
export function DonutLegend({ data }) {
  const total = data.reduce((s, d) => s + d.total, 0) || 1;
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
      {data.map((d) => (
        <li key={d.id || d.title} className="flex items-center gap-2 min-w-0">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
          <span className="truncate capitalize text-fg">{d.title}</span>
          <span className="amount ml-auto text-xs font-semibold text-fg">
            {Math.round((d.total / total) * 100)}%
          </span>
        </li>
      ))}
    </ul>
  );
}
