import React, { useEffect, useState } from "react";
import { ResponsiveContainer } from "recharts";
import { can } from "../utils/rbac.js";
import { motion } from "framer-motion";

import MagicBento from "../ReactBits/MagicBento.jsx";
import KPITrack from "../ReactBits/KPITrack.jsx";
import ScrollReveal from "../ReactBits/ScrollReveal.jsx";

import Announcements from "./Announcements.jsx";
import LineChart from "./charts/LineChart.jsx";
import AreaChart from "./charts/AreaChart.jsx";
import RadarChart from "./charts/RadarChart.jsx";

/* ===== Colors ===== */
const LINE_COLOR = "#6366f1";
const AREA_COLOR = "#22c55e";
const RADAR_COLOR = "#fcd34d";
const KPI_COLORS = ["#a5b4fc", "#86efac", "#fcd34d", "#fca5a5"];

export default function StudentDashboard() {
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch student metrics
  useEffect(() => {
    const fetchData = async () => {
      if (!token || role !== "student") {
        console.warn("No valid student session found.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://lms-mern-s8k6.onrender.com/api/student/data", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load student data");
        }

        // ✅ Backend returns an array, pick the first student
        if (Array.isArray(data) && data.length > 0) {
          setStudentData(data[0]);
        } else {
          setStudentData(null);
        }
      } catch (err) {
        console.error("Error fetching student data:", err.message);
        setStudentData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, role]);

  if (loading)
    return <p className="text-center">Loading student dashboard...</p>;
  if (!studentData)
    return (
      <p className="text-center text-red-500">
        No student data available.
      </p>
    );

  // Safe calculations
  const avgScore =
    studentData.progress?.length > 0
      ? Math.round(
          studentData.progress.reduce((a, b) => a + b.score, 0) /
            studentData.progress.length
        )
      : 0;

  const totalMinutes =
    studentData.timeSpent?.length > 0
      ? studentData.timeSpent.reduce((a, b) => a + b.minutes, 0)
      : 0;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      {can(role, "kpis") && (
        <KPITrack
          items={[
            {
              title: "Avg Weekly Score",
              value: `${avgScore}%`,
              helper: "Last 6 weeks",
              color: KPI_COLORS[0],
            },
            {
              title: "Time Spent",
              value: `${totalMinutes} min`,
              helper: "Total study time",
              color: KPI_COLORS[1],
            },
            {
              title: "Upcoming Tasks",
              value: studentData.deadlines?.length || 0,
              helper: "Next 10 days",
              color: KPI_COLORS[2],
            },
            {
              title: "Quizzes Taken",
              value: studentData.quizHistory?.length || 0,
              helper: "Recent",
              color: KPI_COLORS[3],
            },
          ]}
        />
      )}

      {/* Weekly Progress */}
      {can(role, "progressChart") && studentData.progress?.length > 0 && (
        <MagicBento
          title="Weekly Progress"
          spotlightColor="rgba(99, 102, 241, 0.16)"
        >
          <ScrollReveal>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={studentData.progress}
                  dataKey="score"
                  xLabel="week"
                  strokeColor={LINE_COLOR}
                  strokeWidth={2}
                  height={300}
                  dot={false}
                />
              </ResponsiveContainer>
            </div>
          </ScrollReveal>
        </MagicBento>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Study Time */}
        {can(role, "timeSpentChart") && studentData.timeSpent?.length > 0 && (
          <MagicBento
            title="Study Time"
            spotlightColor="rgba(34, 197, 94, 0.14)"
          >
            <ScrollReveal>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={studentData.timeSpent}
                    dataKey="minutes"
                    xLabel="week"
                    strokeColor={AREA_COLOR}
                    gradientId="colorTime"
                    height={300}
                  />
                </ResponsiveContainer>
              </div>
            </ScrollReveal>
          </MagicBento>
        )}

        {/* Topic Mastery */}
        {can(role, "topicMasteryChart") &&
          studentData.topicMastery?.length > 0 && (
            <MagicBento
              title="Topic Mastery"
              spotlightColor="rgba(252, 211, 77, 0.18)"
            >
              <ScrollReveal>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      data={studentData.topicMastery}
                      dataKey="mastery"
                      angleKey="topic"
                      name="Mastery"
                      strokeColor={RADAR_COLOR}
                      fillColor={RADAR_COLOR}
                      fillOpacity={0.4}
                      height={300}
                    />
                  </ResponsiveContainer>
                </div>
              </ScrollReveal>
            </MagicBento>
          )}
      </div>

      {/* Deadlines & Quiz History */}
      <div className="grid lg:grid-cols-2 gap-6">
        {can(role, "deadlinesTable") &&
          studentData.deadlines?.length > 0 && (
            <Deadlines deadlines={studentData.deadlines} />
          )}
        {can(role, "quizTable") && studentData.quizHistory?.length > 0 && (
          <QuizHistory quizHistory={studentData.quizHistory} />
        )}
      </div>

      {/* Announcements */}
      {can(role, "announcements") &&
        studentData.announcements?.length > 0 && (
          <Announcements items={studentData.announcements} />
        )}
    </div>
  );
}

/* ---------- Tables ---------- */
function Deadlines({ deadlines }) {
  return (
    <MagicBento
      title="Upcoming Deadlines"
      spotlightColor="rgba(99, 102, 241, 0.12)"
    >
      <ScrollReveal>
        <div>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>Course</Th>
                <Th>Task</Th>
                <Th>Due</Th>
              </tr>
            </thead>
            <tbody>
              {deadlines.map((d) => (
                <motion.tr
                  key={d._id || d.id}
                  className="hover:bg-gray-100/70"
                  whileHover={{ scale: 1.01 }}
                >
                  <Td>{d.course}</Td>
                  <Td>{d.task}</Td>
                  <Td>{d.due}</Td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>
    </MagicBento>
  );
}

function QuizHistory({ quizHistory }) {
  return (
    <MagicBento
      title="Quiz History"
      spotlightColor="rgba(34, 197, 94, 0.12)"
    >
      <ScrollReveal>
        <div>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>Course</Th>
                <Th>Score</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {quizHistory.map((q) => (
                <motion.tr
                  key={q._id || q.id}
                  className="hover:bg-gray-100/70"
                  whileHover={{ scale: 1.01 }}
                >
                  <Td>{q.course}</Td>
                  <Td>{q.score}</Td>
                  <Td>{q.date}</Td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>
    </MagicBento>
  );
}

/* ---------- Table helpers ---------- */
const Th = ({ children }) => (
  <th className="text-left px-4 py-2 font-semibold">{children}</th>
);
const Td = ({ children }) => <td className="px-4 py-2">{children}</td>;
