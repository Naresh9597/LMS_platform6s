import React from "react";
import { studentData } from "../data/mock.js";
import {
   ResponsiveContainer,
} from "recharts";
import { can } from "../utils/rbac.js";
import { useAuth } from "../context/RoleContext.jsx";
import ScrollReveal from "../ReactBits/ScrollReveal.jsx";
import MagicBento from "../ReactBits/MagicBento.jsx";
import KPITrack from "../ReactBits/KPITrack.jsx";
import { motion } from "framer-motion";
import Announcements from "../components/Announcements.jsx";
import LineChart from "../components/charts/LineChart.jsx";
import AreaChart from "../components/charts/AreaChart.jsx";
import RadarChart from "../components/charts/RadarChart.jsx";



/* ===== Color system (aligned with Admin Dashboard) ===== */
const LINE_COLOR  = "#6366f1";  // Indigo-500
const AREA_COLOR  = "#22c55e";  // Green-500
const RADAR_COLOR = "#fcd34d";  // Amber-300
const KPI_COLORS  = ["#a5b4fc", "#86efac", "#fcd34d", "#fca5a5"];


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
        
        <MagicBento title="Weekly Progress" spotlightColor="rgba(99, 102, 241, 0.16)">
          <ScrollReveal>
          <div className="h-72">
            
            <ResponsiveContainer width="100%" height="100%">
<LineChart
  data={studentData.progress}   // your data array
  dataKey="score"               // matches the Y-axis value in your data
  xLabel="week"                 // matches the X-axis key in your data
  strokeColor="#6366f1"      // line color
  strokeWidth={2}               // thickness of the line
  height={300}                  // chart height
  dot={false}                   // hide the dots
/>
            </ResponsiveContainer>
          </div>
          </ScrollReveal>
        </MagicBento>
        
        
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ===== Study Time ===== */}
        {can(role, "timeSpentChart") && (
          
          <MagicBento title="Study Time" spotlightColor="rgba(34, 197, 94, 0.14)"><ScrollReveal>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
<AreaChart
  data={studentData.timeSpent}   // your data array
  dataKey="minutes"              // Y-axis value
  xLabel="week"                  // X-axis key
  strokeColor="#22c55e"       // line/area color
  gradientId="colorTime"         // unique gradient ID
  height={300}                   // chart height
/>
              </ResponsiveContainer>
            </div></ScrollReveal>
          </MagicBento>
          
        )}

        {/* ===== Topic Mastery ===== */}
        {can(role, "topicMasteryChart") && (
          
          <MagicBento title="Topic Mastery" spotlightColor="rgba(252, 211, 77, 0.18)"><ScrollReveal>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
<RadarChart
  data={studentData.topicMastery}  // array of topics and mastery values
  dataKey="mastery"                // value key in your data
  angleKey="topic"                 // category key in your data
  name="Mastery"                   // radar label
  strokeColor="#fcd34d"        // stroke color
  fillColor="#fcd34d"         // fill color
  fillOpacity={0.4}                // fill transparency
  height={300}
/>
              </ResponsiveContainer>
            </div></ScrollReveal>
          </MagicBento>
          
        )}
      </div>

     {/* ===== Deadlines & Quiz History ===== */}
<div className="grid lg:grid-cols-2 gap-6">
  {can(role, "deadlinesTable") && (
      <Deadlines />
  )}

  {can(role, "quizTable") && (
      <QuizHistory />
  )}
</div>

      

      {/* ===== Announcements ===== */}
      {can(role, "announcements") && <Announcements items={studentData.announcements} />}
    </div>
  );
}

/* ---------- Tables wrapped in MagicBento ---------- */
function Deadlines() {
  return (
    <MagicBento title="Upcoming Deadlines" spotlightColor="rgba(99, 102, 241, 0.12)"><ScrollReveal>
      <div>
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
                    <motion.tr
                    key={d.id}
                    className="hover:bg-gray-100/70 "
                    whileHover={{ scale: 1.01 }}
                  >
                <Td>{d.course}</Td>
                <Td>{d.task}</Td>
                <Td>{d.due}</Td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div></ScrollReveal>
    </MagicBento>
  );
}

function QuizHistory() {
  return (
    <MagicBento title="Quiz History" spotlightColor="rgba(34, 197, 94, 0.12)"><ScrollReveal>
      <div >
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
              <motion.tr
                          key={q.id}
                                  className="hover:bg-gray-100/70 "
                                  whileHover={{ scale: 1.01 }}
                                >
                <Td>{q.course}</Td>
                <Td>{q.score}</Td>
                <Td>{q.date}</Td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div></ScrollReveal>
    </MagicBento>
  );
}

/*
---------- Announcements ----------
function Announcements({ items }) {
  return (
    <MagicBento title="Announcements" spotlightColor="rgba(252, 211, 77, 0.12)">
      <ScrollReveal>
        <div>
          {items.map(a => (
            <div key={a.id} className="px-1 py-3">
              <motion.div
                key={a.date}
                className="kpi rounded-xl p-3 bg-gray-100 shadow-sm"
                whileHover={{ scale: 1.02 }}>
                <div className="text-sm text-gray-500 dark:text-gray-400">{a.date}</div>
                <div className="font-semibold">{a.title}</div>
                <div className="text-sm">{a.text}</div>
              </motion.div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </MagicBento>
  );
}
*/


/* ---------- Table cells ---------- */
const Th = ({ children }) => <th className="text-left px-4 py-2 font-semibold">{children}</th>;
const Td = ({ children }) => <td className="px-4 py-2">{children}</td>;
