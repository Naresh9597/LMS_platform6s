const users = [
  { id: 1, name: 'Sivaganesh', username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Naresh B', username: 'student', password: 'student123', role: 'student' }
]

const adminMetrics = {
  activeUsers: 1245,
  newSignups: 120,
  churnRate: 3.2,
  completionRate: 72,
  avgSessionMins: 34,
  weeklyActive: [450, 520, 610, 700, 640, 730, 810],
  completionTrend: [62, 64, 65, 68, 70, 71, 72],
  courseDistribution: [
    { name: 'React', value: 320 },
    { name: 'JS', value: 280 },
    { name: 'DSA', value: 200 },
    { name: 'DBMS', value: 160 }
  ],
  topCourses: [
    { name: 'Advanced JS', enrollments: 280, rating: 4.7 },
    { name: 'Intro to React', enrollments: 320, rating: 4.5 },
    { name: 'Data Structures', enrollments: 200, rating: 4.3 },
  ],
  courses: [
    { id: 101, title: 'Intro to React', enrollments: 320, completion: 68, rating: 4.5 },
    { id: 102, title: 'Advanced JS', enrollments: 280, completion: 74, rating: 4.7 },
    { id: 103, title: 'Data Structures', enrollments: 200, completion: 65, rating: 4.3 },
    { id: 104, title: 'DBMS Essentials', enrollments: 160, completion: 61, rating: 4.2 },
  ],
  leaderboard: [
    { id: 1, name: 'Ananya', score: 96 },
    { id: 2, name: 'Rahul', score: 93 },
    { id: 3, name: 'Ishaan', score: 90 },
    { id: 4, name: 'Meera', score: 88 },
    { id: 5, name: 'Divya', score: 86 },
  ],
  announcements: [
    { id: 1, title: 'New Course Publishing Flow', date: '2025-08-15', text: 'Streamlined approvals for faster publishing.' },
    { id: 2, title: 'Maintenance Window', date: '2025-08-20', text: 'System maintenance on Aug 20, 1–3 AM IST.' }
  ],
  ratingBuckets: [
    { label: '5★', value: 54 },
    { label: '4★', value: 32 },
    { label: '3★', value: 10 },
    { label: '2★', value: 3 },
    { label: '1★', value: 1 }
  ]
}

const studentData = {
  name: 'Naresh B',
  progress: [
    { week: 'W1', score: 60 },
    { week: 'W2', score: 70 },
    { week: 'W3', score: 68 },
    { week: 'W4', score: 75 },
    { week: 'W5', score: 82 },
    { week: 'W6', score: 85 }
  ],
  timeSpent: [
    { week: 'W1', minutes: 120 },
    { week: 'W2', minutes: 150 },
    { week: 'W3', minutes: 140 },
    { week: 'W4', minutes: 160 },
    { week: 'W5', minutes: 190 },
    { week: 'W6', minutes: 210 }
  ],
  topicMastery: [
    { topic: 'React', mastery: 80 },
    { topic: 'JS', mastery: 75 },
    { topic: 'DSA', mastery: 68 },
    { topic: 'DBMS', mastery: 88 }
  ],
  deadlines: [
    { id: 1, course: 'React Basics', task: 'Assignment 2', due: '2025-08-20' },
    { id: 2, course: 'Algorithms', task: 'Quiz 3', due: '2025-08-22' },
    { id: 3, course: 'DBMS', task: 'Project Proposal', due: '2025-08-25' },
  ],
  quizHistory: [
    { id: 11, course: 'React Basics', score: 85, date: '2025-08-01' },
    { id: 12, course: 'Algorithms', score: 78, date: '2025-08-05' },
    { id: 13, course: 'DBMS', score: 92, date: '2025-08-09' },
  ],
  announcements: [
    { id: 1, title: 'Live Doubt Session', date: '2025-08-18', text: 'Join live session at 7 PM IST.' },
    { id: 2, title: 'Quiz Retake Policy', date: '2025-08-19', text: 'One retake allowed within 48 hours.' }
  ]
}

const chatbotPairs = {
  admin: [
    { q: ["help", "commands", "what can you do"], a: "Try: usage this week, completion trend, course distribution, rating breakdown, top courses, leaderboard, announcements, publish course, reset password policy." },
    { q: ["usage this week", "org usage", "usage stats"], a: `This week: ${adminMetrics.weeklyActive.slice(-1)[0]} WAU, ${adminMetrics.completionRate}% completion, ${adminMetrics.avgSessionMins} mins avg session.` },
    { q: ["active users chart", "users chart"], chart: { type: "bar", dataset: "adminWeeklyActive" } },
    { q: ["completion trend", "completion chart"], chart: { type: "area", dataset: "adminCompletionTrend" } },
    { q: ["course distribution", "courses breakdown"], chart: { type: "pie", dataset: "adminCourseDistribution" } },
    { q: ["rating breakdown", "ratings"], chart: { type: "bar", dataset: "adminRatingBuckets" } },
    { q: ["top courses", "enrollments"], a: "Top courses: " + adminMetrics.topCourses.map(c => `${c.name} (${c.enrollments})`).join(", ") },
    { q: ["leaderboard"], a: "Leaderboard: " + adminMetrics.leaderboard.slice(0, 3).map((p, i) => `${i + 1}. ${p.name} (${p.score})`).join(" | ") },
    { q: ["announcements", "updates"], a: "Announcements: " + adminMetrics.announcements.map(a => `${a.title} on ${a.date}`).join("; ") },
  ],
  student: [
    { q: ["help", "commands"], a: "Try: weekly progress, time spent, mastery, deadlines, quiz scores, announcements, study tips, contact support." },
    { q: ["weekly progress", "show my progress", "progress chart"], chart: { type: "line", dataset: "studentProgress" } },
    { q: ["time spent", "study time"], chart: { type: "area", dataset: "studentTimeSpent" } },
    { q: ["mastery", "skills"], chart: { type: "radar", dataset: "studentTopicMastery" } },
    { q: ["deadlines", "what is due", "upcoming"], a: "Upcoming: " + studentData.deadlines.map(d => `${d.task} (${d.course}) due ${d.due}`).join("; ") },
    { q: ["quiz scores", "history"], a: "Recent quizzes: " + studentData.quizHistory.map(q => `${q.course}:${q.score}`).join(", ") },
    { q: ["announcements"], a: "Announcements: " + studentData.announcements.map(a => `${a.title} on ${a.date}`).join("; ") },
  ],
};

function datasetFor(key) {
  switch (key) {
    case "adminWeeklyActive": return adminMetrics.weeklyActive.map((v, i) => ({ day: "D" + (i + 1), users: v }));
    case "adminCompletionTrend": return adminMetrics.completionTrend.map((v, i) => ({ week: "W" + (i + 1), rate: v }));
    case "adminCourseDistribution": return adminMetrics.courseDistribution;
    case "adminRatingBuckets": return adminMetrics.ratingBuckets.map(b => ({ bucket: b.label, count: b.value }));
    case "studentProgress": return studentData.progress;
    case "studentTimeSpent": return studentData.timeSpent;
    case "studentTopicMastery": return studentData.topicMastery;
    default: return [];
  }
}

function matchChatIntent(role, text) {
  const rules = chatbotPairs[role] || [];
  const t = text.toLowerCase();
  for (const r of rules) {
    if (r.q.some(k => t.includes(k))) return r;
  }
  return null;
}

module.exports = { users,adminMetrics, studentData, chatbotPairs, datasetFor, matchChatIntent };
