import React from "react"
import {
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function RadarChart({
  data = [],
  dataKey = "value",       // Y-axis key
  name = "Data",           // Radar name
  angleKey = "label",      // X-axis / category key
  strokeColor = "#8b5cf6", // Radar stroke color
  fillColor = "#8b5cf6",   // Radar fill color
  fillOpacity = 0.4,
  height = 300,
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsRadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey={angleKey} stroke="#6b7280" />
        <PolarRadiusAxis />
        <Radar
          name={name}
          dataKey={dataKey}
          stroke={strokeColor}
          fill={fillColor}
          fillOpacity={fillOpacity}
        />
        <Tooltip />
      </RechartsRadarChart>
    </ResponsiveContainer>
  )
}
