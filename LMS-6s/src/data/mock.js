export const users = [
  { id: 1, name: 'Sivaganesh', username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Naresh B', username: 'student', password: 'student123', role: 'student' }
]

export const adminMetrics = {
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

export const studentData = {
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
