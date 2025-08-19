import React from "react"
import {
  AreaChart as RechartsAreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function AreaChart({
  data = [],
  dataKey = "value",
  xLabel = "label",
  strokeColor = "#6366f1",
  gradientId = "colorGradient",
  height = 300,
}) {
  const chartData =
    data.length && typeof data[0] === "number"
      ? data.map((v, i) => ({ [xLabel]: "W" + (i + 1), [dataKey]: v }))
      : data

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={chartData}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.5} />
            <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xLabel} stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={strokeColor}
          fill={`url(#${gradientId})`}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}
