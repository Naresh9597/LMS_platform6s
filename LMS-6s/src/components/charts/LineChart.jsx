import React from "react"
import {
  LineChart as RechartsLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function LineChart({
  data = [],
  dataKey = "value",       // Y-axis key
  xLabel = "label",        // X-axis key
  strokeColor = "#6366f1", // Line color
  strokeWidth = 2,
  height = 300,
}) {
  // Transform simple array data into {label, value} format if needed
  const chartData =
    data.length && typeof data[0] === "number"
      ? data.map((v, i) => ({ [xLabel]: "D" + (i + 1), [dataKey]: v }))
      : data

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xLabel} stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
