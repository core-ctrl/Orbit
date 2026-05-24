"use client";

import {
  Area,
  AreaChart as RechartAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export interface ChartPoint {
  label: string;
  value: number;
}

export function AreaChart({
  data,
  color = "#44d7b6",
  unit = ""
}: {
  data: ChartPoint[];
  color?: string;
  unit?: string;
}): JSX.Element {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartAreaChart data={data} margin={{ left: -24, right: 8, top: 12, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${color.slice(1)}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.26} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#1d2b42" strokeDasharray="3 3" />
        <XAxis dataKey="label" tick={{ fill: "#91a0ba", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#91a0ba", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#0e1523", border: "1px solid #1d2b42", borderRadius: 12 }}
          formatter={(value: number) => [`${value}${unit}`, "Value"]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${color.slice(1)})`}
        />
      </RechartAreaChart>
    </ResponsiveContainer>
  );
}
