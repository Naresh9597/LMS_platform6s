import React from "react";
import { studentData } from "../data/mock.js";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { can } from "../utils/rbac.js";
import { useAuth } from "../context/RoleContext.jsx";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const { session } = useAuth();
  const role = session.role;

  const avgScore = Math.round(
    studentData.progress.reduce((a, b) => a + b.score, 0) /
      studentData.progress.length
  );
  const totalMinutes = studentData.timeSpent.reduce((a, b) => a + b.minutes, 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      {can(role, "kpis") && (
        <div className="grid-cards">
          <KPI title="Avg Weekly Score" value={avgScore + "%"} helper="Last 6 weeks" />
          <KPI title="Time Spent" value={totalMinutes + " min"} helper="Total study time" />
          <KPI title="Upcoming Tasks" value={studentData.deadlines.length} helper="Next 10 days" />
          <KPI title="Quizzes Taken" value={studentData.quizHistory.length} helper="Recent" />
        </div>
      )}

      {/* Weekly Progress Chart */}
      {can(role, "progressChart") && (
        <MotionCard title="Weekly Progress">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentData.progress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </MotionCard>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Study Time Chart */}
        {can(role, "timeSpentChart") && (
          <MotionCard title="Study Time">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studentData.timeSpent}>
                  <defs>
                    <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Area type="monotone" dataKey="minutes" stroke="#22c55e" fill="url(#colorTime)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </MotionCard>
        )}

        {/* Topic Mastery Chart */}
        {can(role, "topicMasteryChart") && (
          <MotionCard title="Topic Mastery">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={studentData.topicMastery}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="topic" stroke="#6b7280" />
                  <PolarRadiusAxis />
                  <Radar name="Mastery" dataKey="mastery" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </MotionCard>
        )}
      </div>

      {/* Deadlines & Quiz History */}
      <div className="grid lg:grid-cols-2 gap-6">
        {can(role, "deadlinesTable") && <Deadlines />}
        {can(role, "quizTable") && <QuizHistory />}
      </div>

      {/* Announcements */}
      {can(role, "announcements") && <Announcements items={studentData.announcements} />}
    </div>
  );
}

/* Motion Card */
function MotionCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card p-4 shadow-md rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur"
    >
      <h3 className="font-semibold mb-2">{title}</h3>
      <div>{children}</div>
    </motion.div>
  );
}

/* KPI Card */
function KPI({ title, value, helper }) {
  return (
    <motion.div
      className="kpi hover:shadow-lg transition rounded-xl p-4 bg-white/50 dark:bg-zinc-800/50"
      whileHover={{ scale: 1.03 }}
    >
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className="text-3xl font-extrabold mt-1">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helper}</div>
    </motion.div>
  );
}

/* Deadlines Table */
function Deadlines() {
  return (
    <MotionCard title="Upcoming Deadlines">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              <Th>Course</Th>
              <Th>Task</Th>
              <Th>Due</Th>
            </tr>
          </thead>
          <tbody>
            {studentData.deadlines.map(d => (
              <tr key={d.id} className="hover:bg-gray-100 dark:hover:bg-white/10">
                <Td>{d.course}</Td>
                <Td>{d.task}</Td>
                <Td>{d.due}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MotionCard>
  );
}

/* Quiz History Table */
function QuizHistory() {
  return (
    <MotionCard title="Quiz History">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              <Th>Course</Th>
              <Th>Score</Th>
              <Th>Date</Th>
            </tr>
          </thead>
          <tbody>
            {studentData.quizHistory.map(q => (
              <tr key={q.id} className="hover:bg-gray-100 dark:hover:bg-white/10">
                <Td>{q.course}</Td>
                <Td>{q.score}</Td>
                <Td>{q.date}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MotionCard>
  );
}

/* Announcements */
function Announcements({ items }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b dark:border-white/10 flex items-center justify-between">
        <h3 className="font-semibold">Announcements</h3>
      </div>
      <div className="divide-y dark:divide-white/10">
        {items.map(a => (
          <div key={a.id} className="px-4 py-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">{a.date}</div>
            <div className="font-semibold">{a.title}</div>
            <div className="text-sm">{a.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const Th = ({ children }) => <th className="text-left px-4 py-2 font-semibold">{children}</th>;
const Td = ({ children }) => <td className="px-4 py-2">{children}</td>;
