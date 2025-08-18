import React from "react";
import { adminMetrics } from "../data/mock.js";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { can } from "../utils/rbac.js";
import { useAuth } from "../context/RoleContext.jsx";
import { motion } from "framer-motion";
import ScrollReveal from "../ReactBits/ScrollReveal.jsx";
import MagicBento from "../ReactBits/MagicBento.jsx";
import KPITrack from "../ReactBits/KPITrack.jsx";

/* ===== Colors ===== */
const PIE_COLORS = ["#a5b4fc", "#86efac", "#fcd34d", "#fca5a5"];
const LINE_COLOR = "#6366f1";
const AREA_COLOR = "#22c55e";
const BAR_COLOR = "#fcd34d";




export default function AdminDashboard() {
  const { session } = useAuth();
  const role = session.role;

  return (
    <div className="space-y-8">
      {/* KPIs */}
      {can(role, "kpis") && (
        <KPITrack
          items={[
            { title: "Active Users", value: adminMetrics.activeUsers, helper: "+9% WoW", color: "#a5b4fc" },
            { title: "Completion Rate", value: adminMetrics.completionRate + "%", helper: "Target 80%", color: "#86efac" },
            { title: "Avg Session (min)", value: adminMetrics.avgSessionMins, helper: "Last 7 days", color: "#fcd34d" },
            { title: "New Signups", value: adminMetrics.newSignups, helper: "This week", color: "#fca5a5" },
          ]}
        />
      )}

      {/* Completion Trend */}
      {can(role, "completionChart") && (
        <ScrollReveal>
        <MagicBento title="Completion Trend" spotlightColor="rgba(34, 197, 94, 0.14)">
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={adminMetrics.completionTrend.map((v, i) => ({ week: "W" + (i + 1), rate: v }))}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={AREA_COLOR} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={AREA_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Area type="monotone" dataKey="rate" stroke={AREA_COLOR} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </MagicBento>
        </ScrollReveal>
      )}

      {/* Org Stats + Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        {can(role, "orgStats") && (
          <ScrollReveal>
          <MagicBento title="Weekly Active Users" spotlightColor="rgba(99, 102, 241, 0.16)">
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={adminMetrics.weeklyActive.map((v, i) => ({ day: "D" + (i + 1), users: v }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke={LINE_COLOR} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </MagicBento>
          </ScrollReveal>
        )}
        {can(role, "distributionChart") && (
          <ScrollReveal>
          <MagicBento title="Course Distribution" spotlightColor="rgba(252, 211, 77, 0.16)">
            <div className="h-72">
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
            </div>
          </MagicBento>
          </ScrollReveal>
        )}
      </div>

      {/* Ratings Breakdown */}
      {can(role, "ratingBreakdown") && (
        <ScrollReveal>
        <MagicBento title="Ratings Breakdown" spotlightColor="rgba(252, 211, 77, 0.18)">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={adminMetrics.ratingBuckets.map(b => ({ bucket: b.label, count: b.value }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="bucket" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="count" fill={BAR_COLOR} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MagicBento>
        </ScrollReveal>
      )}

      {/* Courses Table */}
      {can(role, "coursesTable") && (
        <ScrollReveal>
        <MagicBento title="Courses Overview" badge="Admin-only" spotlightColor="rgba(99, 102, 241, 0.12)">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-800">
                <tr>
                  <Th>Course</Th>
                  <Th>Enrollments</Th>
                  <Th>Completion %</Th>
                  <Th>Rating</Th>
                </tr>
              </thead>
              <tbody>
                {adminMetrics.courses.map(c => (
                  <motion.tr
                    key={c.id}
                    className="hover:bg-gray-100/70 dark:hover:bg-white/10"
                    whileHover={{ scale: 1.01 }}
                  >
                    <Td>{c.title}</Td>
                    <Td>{c.enrollments}</Td>
                    <Td>{c.completion}%</Td>
                    <Td>{"★".repeat(Math.round(c.rating))} ({c.rating})</Td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </MagicBento>
        </ScrollReveal>
      )}

      {/* Leaderboard + Announcements */}
<div className="grid lg:grid-cols-2 gap-6">
  {can(role, "leaderboard") && (
    <ScrollReveal delay={0.1}>
      <div className="h-full">
        <Leaderboard />
      </div>
    </ScrollReveal>
  )}

  {can(role, "announcements") && (
    <ScrollReveal delay={0.3}>
      <div className="h-full">
        <Announcements items={adminMetrics.announcements} />
      </div>
    </ScrollReveal>
  )}
</div>



      {/* Trending Courses */}
      {can(role, "trending") && (

        <ScrollReveal>
        <MagicBento title="Trending Courses" spotlightColor="rgba(34, 197, 94, 0.12)">
          <div className="grid sm:grid-cols-2 gap-4">
            {adminMetrics.topCourses.map(c => (
              <motion.div
                key={c.name}
                className="kpi rounded-xl p-3 bg-gray-100 dark:bg-zinc-800 shadow-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-sm text-gray-600 dark:text-gray-300">{c.name}</div>
                <div className="text-xl font-semibold mt-1">{c.enrollments} enrollments</div>
                <div className="text-xs opacity-70 mt-1">Rating {c.rating}★</div>
              </motion.div>
            ))}
          </div>
        </MagicBento>
        </ScrollReveal>
      )}
    </div>
  );
}

/* KPI Sliding Track
function KPITrack({ items }) {
  return (
    <div className="relative w-full overflow-hidden py-2">
      <motion.div
        className="flex gap-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
      >
        {[...items, ...items].map((kpi, i) => <AdminKPI key={i} {...kpi} />)}
      </motion.div>
    </div>
  );
}
*/


/* 
-------------------- Admin KPI --------------------
function AdminKPI({ title, value, helper, color }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className="relative min-w-[220px] shrink-0 rounded-xl p-4 shadow-md border border-black/5"
      style={{ background: `${color}30` }}
    >
      <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
      <div className="text-3xl font-extrabold mt-1">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helper}</div>
    </motion.div>
  );
}

-------------------- Magic Bento Wrapper --------------------
function MagicBento({ title, badge, children, spotlightColor, className = "" }) {
  return (
    <SpotlightCard
      className={`relative rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-white/70 dark:bg-zinc-900/60 backdrop-blur h-full flex flex-col ${className}`}
      spotlightColor={spotlightColor}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="p-4 flex flex-col flex-1"
      >
        <div className="flex items-center justify-between mb-2">
          {title && <h3 className="font-semibold">{title}</h3>}
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </div>
        <div className="flex-1">{children}</div>
      </motion.div>
    </SpotlightCard>
  );
}
*/




/* Leaderboard */
function Leaderboard() {
  return (
    <MagicBento title="Leaderboard" spotlightColor="rgba(99, 102, 241, 0.12)">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-zinc-800">
          <tr>
            <Th>Rank</Th>
            <Th>Student</Th>
            <Th>Points</Th>
          </tr>
        </thead>
        <tbody>
          {adminMetrics.leaderboard.map((student, index) => (
            <tr key={student.id} className="hover:bg-gray-100/70 dark:hover:bg-white/10">
              <Td>{index + 1}</Td>
              <Td>{student.name}</Td>
              <Td>{student.score}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </MagicBento>
  );
}

/* Announcements */
function Announcements({ items }) {
  return (
    <MagicBento title="Announcements" spotlightColor="rgba(252, 211, 77, 0.12)">
      <div className="divide-y dark:divide-white/10">
        {items.map(a => (
          <div key={a.id} className="px-1 py-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">{a.date}</div>
            <div className="font-semibold">{a.title}</div>
            <div className="text-sm">{a.text}</div>
          </div>
        ))}
      </div>
    </MagicBento>
  );
}

/* Table helpers */
const Th = ({ children }) => <th className="text-left px-4 py-2 font-semibold">{children}</th>;
const Td = ({ children }) => <td className="px-4 py-2">{children}</td>;
