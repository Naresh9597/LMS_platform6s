import React from "react";
import { studentData } from "../data/mock.js";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { can } from "../utils/rbac.js";
import { useAuth } from "../context/RoleContext.jsx";
import ScrollReveal from "../ReactBits/ScrollReveal.jsx";
import MagicBento from "../ReactBits/MagicBento.jsx";
import KPITrack from "../ReactBits/KPITrack.jsx";


/* ===== Color system (aligned with Admin Dashboard) ===== */
const LINE_COLOR  = "#6366f1";  // Indigo-500
const AREA_COLOR  = "#22c55e";  // Green-500
const RADAR_COLOR = "#fcd34d";  // Amber-300
const KPI_COLORS  = ["#a5b4fc", "#86efac", "#fcd34d", "#fca5a5"];

/*
===== Magic Bento wrapper: Spotlight + subtle scale on hover =====

function MagicBento({ title, children, spotlightColor = "rgba(99, 102, 241, 0.18)", className = "" }) {
  return (
    <SpotlightCard
      className={`relative rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-white/70 dark:bg-zinc-900/60 backdrop-blur ${className}`}
      spotlightColor={spotlightColor}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="p-4"
      >
        {title ? <h3 className="font-semibold mb-2">{title}</h3> : null}
        {children}
      </motion.div>

      // Soft highlight ring on hover
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: "0 0 0 1px rgba(99,102,241,0.25) inset" }}
      />
    </SpotlightCard>
  );
}
*/



export default function StudentDashboard() {
  const { session } = useAuth();
  const role = session.role;

  const avgScore = Math.round(
    studentData.progress.reduce((a, b) => a + b.score, 0) / studentData.progress.length
  );
  const totalMinutes = studentData.timeSpent.reduce((a, b) => a + b.minutes, 0);

  return (
    <div className="space-y-6">
      {/* ===== KPIs (flow track) ===== */}
      {can(role, "kpis") && (
        <KPITrack
          items={[
            { title: "Avg Weekly Score", value: `${avgScore}%`, helper: "Last 6 weeks", color: KPI_COLORS[0] },
            { title: "Time Spent", value: `${totalMinutes} min`, helper: "Total study time", color: KPI_COLORS[1] },
            { title: "Upcoming Tasks", value: studentData.deadlines.length, helper: "Next 10 days", color: KPI_COLORS[2] },
            { title: "Quizzes Taken", value: studentData.quizHistory.length, helper: "Recent", color: KPI_COLORS[3] },
          ]}
        />
      )}

      {/* ===== Weekly Progress ===== */}
      {can(role, "progressChart") && (
        <ScrollReveal>
        <MagicBento title="Weekly Progress" spotlightColor="rgba(99, 102, 241, 0.16)">
          
          <div className="h-72">
            
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentData.progress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke={LINE_COLOR} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
        </MagicBento>
        </ScrollReveal>
        
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ===== Study Time ===== */}
        {can(role, "timeSpentChart") && (
          <ScrollReveal>
          <MagicBento title="Study Time" spotlightColor="rgba(34, 197, 94, 0.14)">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studentData.timeSpent}>
                  <defs>
                    <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={AREA_COLOR} stopOpacity={0.6} />
                      <stop offset="95%" stopColor={AREA_COLOR} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Area type="monotone" dataKey="minutes" stroke={AREA_COLOR} fill="url(#colorTime)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </MagicBento>
          </ScrollReveal>
        )}

        {/* ===== Topic Mastery ===== */}
        {can(role, "topicMasteryChart") && (
          <ScrollReveal>
          <MagicBento title="Topic Mastery" spotlightColor="rgba(252, 211, 77, 0.18)">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={studentData.topicMastery}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="topic" stroke="#6b7280" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Mastery"
                    dataKey="mastery"
                    stroke={RADAR_COLOR}
                    fill={RADAR_COLOR}
                    fillOpacity={0.4}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </MagicBento>
          </ScrollReveal>
        )}
      </div>

     {/* ===== Deadlines & Quiz History ===== */}
<div className="grid lg:grid-cols-2 gap-6">
  {can(role, "deadlinesTable") && (
    <ScrollReveal delay={0.1}>
      <Deadlines />
    </ScrollReveal>
  )}

  {can(role, "quizTable") && (
    <ScrollReveal delay={0.3}>
      <QuizHistory />
    </ScrollReveal>
  )}
</div>

      

      {/* ===== Announcements ===== */}
      <ScrollReveal>
      {can(role, "announcements") && <Announcements items={studentData.announcements} />}
      </ScrollReveal>
    </div>
  );
}


/*
---------- KPI Flowing Track ----------
function KPITrack({ items }) {
  return (
    <div className="relative w-full overflow-hidden py-2">
      <motion.div
        className="flex gap-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {[...items, ...items].map((kpi, i) => <KPI key={i} {...kpi} />)}
      </motion.div>
    </div>
  );
}

---------- KPI Card (with light pastel BG + hover lift) ----------
function KPI({ title, value, helper, color }) {
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
*/

/* ---------- Tables wrapped in MagicBento ---------- */
function Deadlines() {
  return (
    <MagicBento title="Upcoming Deadlines" spotlightColor="rgba(99, 102, 241, 0.12)">
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
              <tr key={d.id} className="hover:bg-gray-100/70 dark:hover:bg-white/10">
                <Td>{d.course}</Td>
                <Td>{d.task}</Td>
                <Td>{d.due}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MagicBento>
  );
}

function QuizHistory() {
  return (
    <MagicBento title="Quiz History" spotlightColor="rgba(34, 197, 94, 0.12)">
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
              <tr key={q.id} className="hover:bg-gray-100/70 dark:hover:bg-white/10">
                <Td>{q.course}</Td>
                <Td>{q.score}</Td>
                <Td>{q.date}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MagicBento>
  );
}

/* ---------- Announcements ---------- */
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

/* ---------- Table cells ---------- */
const Th = ({ children }) => <th className="text-left px-4 py-2 font-semibold">{children}</th>;
const Td = ({ children }) => <td className="px-4 py-2">{children}</td>;
