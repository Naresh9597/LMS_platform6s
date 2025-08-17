import React, { useRef, useState, useEffect } from "react"
import { useAuth } from "../context/RoleContext.jsx"
import { matchChatIntent, datasetFor } from "../data/chatbot.js"
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell,
} from "recharts"

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function ChatPanel({ open, onClose, seed = "" }) {
  const { session } = useAuth()
  const role = session?.role || "student"
  const [input, setInput] = useState(seed)
  const [messages, setMessages] = useState([])
  const threadRef = useRef(null)

  // Initialize messages when panel opens
  useEffect(() => {
    if (open) {
      const greet = {
        from: "bot",
        type: "text",
        text: `Hi ${session?.name || ""}! You are in ${role.toUpperCase()} view. 
        Ask me about metrics, deadlines, courses, leaderboard, ratings.`,
      }
      setMessages([greet])
      setInput(seed || "")
    }
  }, [open, role, seed])

  // Auto scroll to bottom
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTo({
        top: threadRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  if (!open) return null

  // Send handler
  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [...prev, { from: "user", type: "text", text }])
    setInput("")
    const intent = matchChatIntent(role, text)

    if (!intent) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          type: "text",
          text: "I couldn't find that. Try: 'completion trend', 'rating breakdown', 'weekly progress', 'deadlines'.",
        },
      ])
      return
    }
    if (intent.a)
      setMessages((prev) => [...prev, { from: "bot", type: "text", text: intent.a }])
    if (intent.chart) {
      const data = datasetFor(intent.chart.dataset)
      setMessages((prev) => [
        ...prev,
        { from: "bot", type: "chart", chart: { type: intent.chart.type, data } },
      ])
    }
  }

  // Chart renderer
  const renderChart = (m) => {
    switch (m.chart.type) {
      case "line":
        return (
          <ResponsiveContainer>
            <LineChart data={m.chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={m.chart.data[0]?.week ? "week" : "day"} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={m.chart.data[0]?.score ? "score" : "users"}
                stroke="#6366f1"
              />
            </LineChart>
          </ResponsiveContainer>
        )
      case "area":
        return (
          <ResponsiveContainer>
            <AreaChart data={m.chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey={m.chart.data[0]?.minutes ? "minutes" : "rate"}
                stroke="#22c55e"
                fill="#22c55e"
              />
            </AreaChart>
          </ResponsiveContainer>
        )
      case "bar":
        return (
          <ResponsiveContainer>
            <BarChart data={m.chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={m.chart.data[0]?.bucket ? "bucket" : "day"} />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey={m.chart.data[0]?.count ? "count" : "users"}
                fill="#f59e0b"
              />
            </BarChart>
          </ResponsiveContainer>
        )
      case "pie":
        return (
          <ResponsiveContainer>
            <PieChart>
              <Pie dataKey="value" data={m.chart.data} outerRadius={90}>
                {m.chart.data.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      case "radar":
        return (
          <ResponsiveContainer>
            <RadarChart data={m.chart.data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="topic" />
              <PolarRadiusAxis />
              <Radar
                name="Mastery"
                dataKey="mastery"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

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
                className={
                  m.from === "user" ? "flex justify-end" : "flex justify-start"
                }
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
                    <div className="text-xs font-medium px-2 pb-1 opacity-70">
                      Chart
                    </div>
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
              onKeyDown={(e) => (e.key === "Enter" ? send() : null)}
            />
            <button className="btn btn-primary rounded-xl" onClick={send}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
