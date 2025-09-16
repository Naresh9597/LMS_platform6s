import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../context/RoleContext.jsx";

import LineChart from "./charts/LineChart.jsx";
import AreaChart from "./charts/AreaChart.jsx";
import RadarChart from "./charts/RadarChart.jsx";
import PieChart from "./charts/PieChart.jsx";
import BarChart from "./charts/BarChart.jsx";
import { ResponsiveContainer } from "recharts";

const PIE_COLORS = ["#a5b4fc", "#86efac", "#fcd34d", "#fca5a5"];

export default function ChatPanel({ open, onClose, seed = "" }) {
  const { session } = useAuth();
  const role = session?.role || "student";
  const [input, setInput] = useState(seed);
  const [messages, setMessages] = useState([]);
  const threadRef = useRef(null);

  // Initialize messages when panel opens
  useEffect(() => {
    if (open) {
      const greet = {
        from: "bot",
        type: "text",
        text: `Hi ${session?.name || ""}! You are in ${role.toUpperCase()} view. Ask me about metrics, deadlines, courses, leaderboard, ratings.`,
      };
      setMessages([greet]);
      setInput(seed || "");
    }
  }, [open, role, seed, session?.name]);

  // Auto scroll to bottom
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTo({
        top: threadRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  if (!open) return null;

  // Send handler (fetch from backend)
 const send = async () => {
  const text = input.trim();
  if (!text) return;

  // Show user message immediately
  setMessages((prev) => [...prev, { from: "user", type: "text", text }]);
  setInput("");

  try {
    const res = await fetch("http://localhost:4000/api/chatbot/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, text }),
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();

    if (data.type === "text") {
      setMessages((prev) => [...prev, { from: "bot", type: "text", text: data.text }]);
    } else if (data.type === "chart") {
      setMessages((prev) => [
        ...prev,
        { from: "bot", type: "chart", chart: { type: data.chart.type, data: data.chart.data } },
      ]);
    }
  } catch (err) {
    console.error(err);
    setMessages((prev) => [
      ...prev,
      { from: "bot", type: "text", text: "Error fetching response from server." },
    ]);
  }
};


  // Chart renderer
  const renderChart = (m) => {
    switch (m.chart.type) {
      case "line":
        return (
          <ResponsiveContainer height={250}>
            <LineChart
              data={m.chart.data}
              dataKey={m.chart.data[0]?.score ? "score" : "users"}
              xLabel={m.chart.data[0]?.week ? "week" : "day"}
              strokeColor="#6366f1"
              strokeWidth={2}
              dot={false}
            />
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer height={250}>
            <AreaChart
              data={m.chart.data}
              dataKey={m.chart.data[0]?.minutes ? "minutes" : "rate"}
              xLabel={m.chart.data[0]?.week ? "week" : "day"}
              strokeColor="#22c55e"
              gradientId="colorTime"
            />
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer height={250}>
            <BarChart
              data={m.chart.data}
              dataKey={m.chart.data[0]?.count ? "count" : "users"}
              xLabel={m.chart.data[0]?.bucket ? "bucket" : "day"}
              fillColor="#fcd34d"
              radius={[8, 8, 0, 0]}
            />
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer height={250}>
            <PieChart
              data={m.chart.data}
              dataKey="value"
              colors={PIE_COLORS}
              outerRadius={90}
            />
          </ResponsiveContainer>
        );
      case "radar":
        return (
          <ResponsiveContainer height={250}>
            <RadarChart
              data={m.chart.data}
              dataKey="mastery"
              angleKey="topic"
              name="Mastery"
              strokeColor="#8b5cf6"
              fillColor="#8b5cf6"
              fillOpacity={0.6}
            />
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/30">
      {/* Chat box */}
      <div className="mt-[5rem] w-full max-w-3xl mx-2 animate-fade-in">
        <div className="card overflow-hidden shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="px-4 py-2 border-b dark:border-white/10 flex items-center justify-between bg-white/70 dark:bg-zinc-900/70 backdrop-blur">
            <div className="font-semibold">Assistant</div>
            <button className="btn btn-ghost" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* Thread */}
          <div
            ref={threadRef}
            className="max-h-[60vh] overflow-y-auto p-4 space-y-3 bg-white dark:bg-zinc-900"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.from === "user" ? "flex justify-end" : "flex justify-start"}
              >
                {m.type === "text" ? (
                  <div
                    className={
                      m.from === "user"
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[75%]"
                        : "bg-black/5 dark:bg-white/10 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[75%]"
                    }
                  >
                    {m.text}
                  </div>
                ) : (
                  <div className="bg-black/5 dark:bg-white/10 rounded-2xl px-2 py-2 w-[90%]">
                    <div className="text-xs font-medium px-2 pb-1 opacity-70">Chart</div>
                    <div className="h-56 w-full">{renderChart(m)}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t dark:border-white/10 flex gap-2 bg-white dark:bg-zinc-900">
            <input
              className="input flex-1"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="btn btn-primary rounded-xl" onClick={send}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
