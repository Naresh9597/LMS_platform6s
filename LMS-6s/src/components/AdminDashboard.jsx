import React from "react";
import { adminMetrics } from "../data/mock.js";
import {
  ResponsiveContainer
} from "recharts";
import { can } from "../utils/rbac.js";
import { useAuth } from "../context/RoleContext.jsx";
import { motion } from "framer-motion";
import ScrollReveal from "../ReactBits/ScrollReveal.jsx";
import MagicBento from "../ReactBits/MagicBento.jsx";
import KPITrack from "../ReactBits/KPITrack.jsx";
import Announcements from "../components/Announcements.jsx";
import Leaderboard from "../components/Leaderboard.jsx";
import AreaChart from "../components/charts/AreaChart"
import LineChart from "../components/charts/LineChart"
import PieChart from "../components/charts/PieChart"
import BarChart from "../components/charts/BarChart"


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
        
        <MagicBento title="Completion Trend" spotlightColor="rgba(34, 197, 94, 0.14)"><ScrollReveal>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart
  data={adminMetrics.completionTrend}
  dataKey="rate"
  xLabel="week"
  strokeColor="#22c55e"
  gradientId="completionTrendGradient"
  height={250}
/>
            </ResponsiveContainer>
          </div></ScrollReveal>
        </MagicBento>
        
      )}

      {/* Org Stats + Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        {can(role, "orgStats") && (
          
          <MagicBento title="Weekly Active Users" spotlightColor="rgba(99, 102, 241, 0.16)"><ScrollReveal>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart
  data={adminMetrics.weeklyActive}
  dataKey="users"
  xLabel="day"
  strokeColor="#22c55e"
  strokeWidth={3}
  height={250}
/>
              </ResponsiveContainer>
            </div></ScrollReveal>
          </MagicBento>
          
        )}
        {can(role, "distributionChart") && (
          
          <MagicBento title="Course Distribution" spotlightColor="rgba(252, 211, 77, 0.16)"><ScrollReveal>
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart
  data={adminMetrics.courseDistribution}
  dataKey="value"
  outerRadius={100}
  colors={PIE_COLORS}
  height={250}
/>
              </ResponsiveContainer>
            </div></ScrollReveal>
          </MagicBento>
          
        )}
      </div>

      {/* Ratings Breakdown */}
      {can(role, "ratingBreakdown") && (
        <MagicBento title="Ratings Breakdown" spotlightColor="rgba(252, 211, 77, 0.18)"><ScrollReveal>
          <div className="h-72">
            <ResponsiveContainer>
<BarChart
  data={adminMetrics.ratingBuckets.map(b => ({ label: b.label, value: b.value }))}
  dataKey="value"   // matches the property in your mapped data
  xLabel="label"    // matches the property in your mapped data
  fillColor="#fcd34d"
  radius={[8, 8, 0, 0]}
  height={250}
/>
            </ResponsiveContainer>
          </div></ScrollReveal>
        </MagicBento>
        
      )}

      {/* Courses Table */}
      {can(role, "coursesTable") && (
        
        <MagicBento title="Courses Overview" badge="Admin-only" spotlightColor="rgba(99, 102, 241, 0.12)">
          <ScrollReveal>
          <div>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 ">
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
                    className="hover:bg-gray-100/70 "
                    whileHover={{ scale: 1.01 }}
                  >
                    <Td>{c.title}</Td>
                    <Td>{c.enrollments}</Td>
                    <Td>{c.completion}%</Td>
                    <Td>{"★".repeat(Math.floor(c.rating))} ({c.rating})</Td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          </ScrollReveal>
        </MagicBento>
        
      )}

      {/* Leaderboard + Announcements */}
<div className="grid lg:grid-cols-2 gap-6">
  {can(role, "leaderboard") && (
      <div className="h-full">
        <Leaderboard data={adminMetrics.leaderboard} />
      </div>
  )}

  {can(role, "announcements") && (
      <div className="h-full">
        <Announcements items={adminMetrics.announcements} />
      </div>
  )}
</div>
      {/* Trending Courses */}
      {can(role, "trending") && (
        <MagicBento title="Trending Courses" spotlightColor="rgba(34, 197, 94, 0.12)">
        <ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {adminMetrics.topCourses.map(c => (
              <motion.div
                key={c.name}
                className="kpi rounded-xl p-3 bg-gray-100 shadow-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-sm text-gray-600">{c.name}</div>
                <div className="text-xl font-semibold mt-1">{c.enrollments} enrollments</div>
                <div className="text-xs opacity-70 mt-1">Rating {c.rating}★</div>
              </motion.div>
            ))}
          </div>
          </ScrollReveal>
        </MagicBento>
      )}
    </div>
  );
}

/* Table helpers */
const Th = ({ children }) => <th className="text-left px-4 py-2 font-semibold">{children}</th>;
const Td = ({ children }) => <td className="px-4 py-2">{children}</td>;
