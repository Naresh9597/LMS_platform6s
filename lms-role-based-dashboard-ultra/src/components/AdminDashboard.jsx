import React from "react";
import { adminMetrics } from "../data/mock.js";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { can } from "../utils/rbac.js";
import { useAuth } from "../context/RoleContext.jsx";
import { motion } from "framer-motion";
import { Badge } from "../components/ui/badge";

const PIE_COLORS = ["#a5b4fc", "#86efac", "#fcd34d", "#fca5a5"]; // soft pastel colors
const LINE_COLOR = "#4ade80"; // gentle green
const AREA_COLOR = "#818cf8"; // soft blue
const BAR_COLOR = "#facc15";  // muted yellow

export default function AdminDashboard() {
  const { session } = useAuth();
  const role = session.role;

  return (
    <div className="space-y-8">
      {/* KPIs */}
      {can(role, "kpis") && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-20 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl p-2 shadow"
        >
          <div className="grid-cards">
            <KPI title="Active Users" value={adminMetrics.activeUsers} helper="+9% WoW" color="#a5b4fc" />
            <KPI title="Completion Rate" value={adminMetrics.completionRate + "%"} helper="Target 80%" color="#86efac" />
            <KPI title="Avg Session (min)" value={adminMetrics.avgSessionMins} helper="Last 7 days" color="#fcd34d" />
            <KPI title="New Signups" value={adminMetrics.newSignups} helper="This week" color="#fca5a5" />
          </div>
        </motion.div>
      )}

      {/* Completion Trend */}
      {can(role, "completionChart") && (
        <MotionCard title="Completion Trend" height="h-72">
          <ResponsiveContainer>
            <AreaChart data={adminMetrics.completionTrend.map((v, i) => ({ week: "W" + (i + 1), rate: v }))}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={AREA_COLOR} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={AREA_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="rate" stroke={AREA_COLOR} fill="url(#colorRate)" />
            </AreaChart>
          </ResponsiveContainer>
        </MotionCard>
      )}

      {/* Org Stats + Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        {can(role, "orgStats") && (
          <MotionCard title="Weekly Active Users" height="h-72">
            <ResponsiveContainer>
              <LineChart data={adminMetrics.weeklyActive.map((v, i) => ({ day: "D" + (i + 1), users: v }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke={LINE_COLOR} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </MotionCard>
        )}
        {can(role, "distributionChart") && (
          <MotionCard title="Course Distribution" height="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={adminMetrics.courseDistribution} dataKey="value" outerRadius={90}>
                  {adminMetrics.courseDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </MotionCard>
        )}
      </div>

      {/* Ratings Breakdown */}
      {can(role, "ratingBreakdown") && (
        <MotionCard title="Ratings Breakdown" height="h-72">
          <ResponsiveContainer>
            <BarChart data={adminMetrics.ratingBuckets.map(b => ({ bucket: b.label, count: b.value }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="bucket" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill={BAR_COLOR} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </MotionCard>
      )}

      {/* Courses Table */}
      {can(role, "coursesTable") && (
        <MotionCard title="Courses Overview" badge="Admin-only" height="min-h-[250px]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="table-head bg-gray-50 dark:bg-zinc-800">
                <tr>
                  <th className="text-left p-2">Course</th>
                  <th className="text-left p-2">Enrollments</th>
                  <th className="text-left p-2">Completion %</th>
                  <th className="text-left p-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {adminMetrics.courses.map(c => (
                  <motion.tr
                    key={c.id}
                    className="table-row hover:bg-gray-100 dark:hover:bg-white/10"
                    whileHover={{ scale: 1.01 }}
                  >
                    <td className="p-2">{c.title}</td>
                    <td className="p-2">{c.enrollments}</td>
                    <td className="p-2">{c.completion}%</td>
                    <td className="p-2">{"★".repeat(Math.round(c.rating))} ({c.rating})</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </MotionCard>
      )}

      {/* Leaderboard + Announcements */}
      <div className="grid lg:grid-cols-2 gap-6">
        {can(role, "leaderboard") && <Leaderboard />}
        {can(role, "announcements") && <Announcements items={adminMetrics.announcements} />}
      </div>

      {/* Trending Courses */}
      {can(role, "trending") && (
        <MotionCard title="Trending Courses" height="min-h-[200px]">
          <div className="grid sm:grid-cols-2 gap-4">
            {adminMetrics.topCourses.map(c => (
              <motion.div
                key={c.name}
                className="kpi hover:shadow-lg transition rounded-xl p-3 bg-gray-100 dark:bg-zinc-800"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-sm text-gray-600 dark:text-gray-300">{c.name}</div>
                <div className="text-xl font-semibold mt-1">{c.enrollments} enrollments</div>
                <div className="text-xs opacity-70 mt-1">Rating {c.rating}★</div>
              </motion.div>
            ))}
          </div>
        </MotionCard>
      )}
    </div>
  );
}

/* Reusable Card with Animation */
function MotionCard({ title, badge, children, height = "h-72" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card p-4 shadow rounded-2xl backdrop-blur bg-white/70 dark:bg-zinc-900/60"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        {badge && <Badge variant="secondary">{badge}</Badge>}
      </div>
      <div className={height}>{children}</div>
    </motion.div>
  );
}

function KPI({ title, value, helper, color }) {
  return (
    <motion.div
      className="kpi hover:shadow-lg transition rounded-xl p-4"
      whileHover={{ scale: 1.03 }}
      style={{ background: color + "30" }} // soft pastel background
    >
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helper}</div>
    </motion.div>
  );
}

function Leaderboard() {
  return (
    <MotionCard title="Leaderboard" height="min-h-[200px]">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-zinc-800">
          <tr>
            <th className="p-2 text-left">Rank</th>
            <th className="p-2 text-left">Student</th>
            <th className="p-2 text-left">Points</th>
          </tr>
        </thead>
        <tbody>
          {adminMetrics.leaderboard.map((student, index) => (
            <tr
              key={student.id}
              className="hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{student.name}</td>
              <td className="p-2">{student.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MotionCard>
  );
}

function Announcements({ items }) {
  return (
    <MotionCard title="Announcements" height="min-h-[200px]">
      <ul className="list-disc pl-4 space-y-2">
        {items.map((a) => (
          <li key={a.id}>
            <span className="font-medium">{a.title}</span> – {a.text} 
            <span className="text-xs text-gray-500 ml-2">({a.date})</span>
          </li>
        ))}
      </ul>
    </MotionCard>
  );
}
