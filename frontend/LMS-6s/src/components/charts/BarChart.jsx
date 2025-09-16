import React from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function BarChart({
  data = [],
  dataKey = "value",   // Y-axis key
  xLabel = "label",    // X-axis key
  fillColor = "#f59e0b",
  radius = [8, 8, 0, 0],
  height = 300,
}) {
  // Transform data if it's an array of numbers
  const chartData =
    data.length && typeof data[0] === "number"
      ? data.map((v, i) => ({ [xLabel]: "B" + (i + 1), [dataKey]: v }))
      : data

  // Debug: log data
  console.log("BarChart data:", chartData)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xLabel} stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip />
        <Bar dataKey={dataKey} fill={fillColor} radius={radius} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
