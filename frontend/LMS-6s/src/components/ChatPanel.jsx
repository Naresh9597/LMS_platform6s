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

  // Send handler
  const send = async () => {
    const text = input.trim();
    if (!text) return;

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

      // Auto-wrap student metrics if returned
      if (data.progress || data.timeSpent || data.topicMastery) {
        const charts = [];

        if (data.progress?.length) {
          charts.push({
            type: "line",
            title: "Weekly Progress",
            data: data.progress,
            dataKey: "score",
            xKey: "week",
            strokeColor: "#6366f1",
          });
        }

        if (data.timeSpent?.length) {
          charts.push({
            type: "area",
            title: "Study Time",
            data: data.timeSpent,
            dataKey: "minutes",
            xKey: "week",
            strokeColor: "#22c55e",
          });
        }

        if (data.topicMastery?.length) {
          charts.push({
            type: "radar",
            title: "Topic Mastery",
            data: data.topicMastery,
            dataKey: "mastery",
            angleKey: "topic",
            strokeColor: "#fcd34d",
          });
        }

        charts.forEach((chart) => {
          setMessages((prev) => [
            ...prev,
            { from: "bot", type: "chart", chart },
          ]);
        });

        return;
      }

      // For regular text or backend-provided chart
      if (data.type === "text") {
        setMessages((prev) => [...prev, { from: "bot", type: "text", text: data.text }]);
      } else if (data.type === "chart") {
        setMessages((prev) => [
          ...prev,
          { from: "bot", type: "chart", chart: data.chart },
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
    const chart = m.chart;
    if (!chart?.data || !chart.data.length) return <div>No data to display</div>;

    switch (chart.type) {
      case "line":
        return (
          <ResponsiveContainer height={250}>
            <LineChart
              data={chart.data}
              dataKey={chart.dataKey || "score"}
              xLabel={chart.xKey || "week"}
              strokeColor={chart.strokeColor || "#6366f1"}
              strokeWidth={2}
              dot={false}
            />
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer height={250}>
            <AreaChart
              data={chart.data}
              dataKey={chart.dataKey || "minutes"}
              xLabel={chart.xKey || "week"}
              strokeColor={chart.strokeColor || "#22c55e"}
              gradientId="colorTime"
            />
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer height={250}>
            <BarChart
              data={chart.data}
              dataKey={chart.dataKey || "count"}
              xLabel={chart.xKey || "day"}
              fillColor={chart.strokeColor || "#fcd34d"}
              radius={[8, 8, 0, 0]}
            />
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer height={250}>
            <PieChart
              data={chart.data}
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
              data={chart.data}
              dataKey={chart.dataKey || "mastery"}
              angleKey={chart.angleKey || "topic"}
              name="Mastery"
              strokeColor={chart.strokeColor || "#fcd34d"}
              fillColor={chart.strokeColor || "#fcd34d"}
              fillOpacity={0.6}
            />
          </ResponsiveContainer>
        );
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/30">
      <div className="mt-[5rem] w-full max-w-3xl mx-2 animate-fade-in">
        <div className="card overflow-hidden shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="px-4 py-2 border-b flex items-center justify-between bg-white/70 backdrop-blur">
            <div className="font-semibold">Assistant</div>
            <button className="btn btn-ghost" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* Thread */}
          <div
            ref={threadRef}
            className="max-h-[60vh] overflow-y-auto p-4 space-y-3 bg-white"
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
                        ? "bg-indigo-500 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[75%]"
                        : "bg-gray-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[75%]"
                    }
                  >
                    {m.text}
                  </div>
                ) : (
                  <div className="bg-gray-200 rounded-2xl px-2 py-2 w-[90%]">
                    <div className="text-xs font-medium px-2 pb-1 opacity-70">
                      {m.chart.title || "Chart"}
                    </div>
                    <div className="h-56 w-full">{renderChart(m)}</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2 bg-white">
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
