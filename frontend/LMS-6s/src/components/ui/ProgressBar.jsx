// src/components/ui/ProgressBar.jsx
import React from "react";

export default function ProgressBar({ value = 0, className = "" }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={`w-full h-3 bg-gray-200 rounded-full ${className}`}>
      <div
        className="h-3 rounded-full bg-indigo-500 transition-all"
        style={{ width: `${pct}%` }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        role="progressbar"
      />
    </div>
  );
}
