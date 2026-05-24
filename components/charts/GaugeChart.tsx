"use client";

import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

export function GaugeChart({
  value,
  color = "#44d7b6"
}: {
  value: number;
  color?: string;
}): JSX.Element {
  const normalized = Math.min(100, Math.max(0, value));
  return (
    <div className="relative h-36">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="62%"
          innerRadius="65%"
          outerRadius="94%"
          barSize={10}
          startAngle={200}
          endAngle={-20}
          data={[{ value: normalized, fill: color }]}
        >
          <RadialBar dataKey="value" background={{ fill: "#1d2b42" }} cornerRadius={8} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-x-0 bottom-5 text-center">
        <span className="text-3xl font-semibold">{normalized.toFixed(1)}</span>
        <span className="text-sm text-muted">%</span>
      </div>
    </div>
  );
}
