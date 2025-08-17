import { adminMetrics, studentData } from './mock.js'

// Simple keyword matching with many intents
export const chatbotPairs = {
  admin: [
    { q: ['help','commands','what can you do'], a: 'Try: usage this week, completion trend, course distribution, rating breakdown, top courses, leaderboard, announcements, publish course, reset password policy.' },
    { q: ['usage this week','org usage','usage stats'], a: `This week: ${adminMetrics.weeklyActive.slice(-1)[0]} WAU, ${adminMetrics.completionRate}% completion, ${adminMetrics.avgSessionMins} mins avg session.` },
    { q: ['active users chart','users chart'], chart: { type: 'bar', dataset: 'adminWeeklyActive' } },
    { q: ['completion trend','completion chart'], chart: { type: 'area', dataset: 'adminCompletionTrend' } },
    { q: ['course distribution','courses breakdown'], chart: { type: 'pie', dataset: 'adminCourseDistribution' } },
    { q: ['rating breakdown','ratings'], chart: { type: 'bar', dataset: 'adminRatingBuckets' } },
    { q: ['top courses','enrollments'], a: 'Top courses by enrollment: ' + adminMetrics.topCourses.map(c=>`${c.name} (${c.enrollments})`).join(', ') + '.' },
    { q: ['leaderboard'], a: 'Leaderboard top 3: ' + adminMetrics.leaderboard.slice(0,3).map((p,i)=>`${i+1}. ${p.name} (${p.score})`).join('  ') },
    { q: ['announcements','updates'], a: 'Announcements: ' + adminMetrics.announcements.map(a=>`${a.title} on ${a.date}`).join('; ') },
    { q: ['publish course','how to publish'], a: 'Workflow: Create → Submit for Review → QA Approval → Publish. New flow reduces approval to <24h.' },
    { q: ['reset password','password policy'], a: 'Password policy: 8+ chars, 1 uppercase, 1 number. Resets are via email OTP (valid 10 min).' }
  ],
  student: [
    { q: ['help','commands'], a: 'Try: weekly progress, time spent, mastery, deadlines, quiz scores, announcements, study tips, contact support.' },
    { q: ['weekly progress','show my progress','progress chart'], chart: { type: 'line', dataset: 'studentProgress' } },
    { q: ['time spent','study time'], chart: { type: 'area', dataset: 'studentTimeSpent' } },
    { q: ['mastery','skills'], chart: { type: 'radar', dataset: 'studentTopicMastery' } },
    { q: ['deadlines','what is due','upcoming'], a: 'Upcoming: ' + studentData.deadlines.map(d=>`${d.task} (${d.course}) due ${d.due}`).join('; ') },
    { q: ['quiz scores','history'], a: 'Recent quizzes: ' + studentData.quizHistory.map(q=>`${q.course}:${q.score}`).join(', ') },
    { q: ['announcements'], a: 'Announcements: ' + studentData.announcements.map(a=>`${a.title} on ${a.date}`).join('; ') },
    { q: ['tips','study tips'], a: 'Tip: 25-min focus blocks, 5-min breaks; review weak topics before quizzes; practice spaced repetition.' },
    { q: ['contact','support'], a: 'Support: support@lmspro.example  | Office hours: Mon–Fri 10am–6pm IST.' }
  ]
}

export function datasetFor(key) {
  switch (key) {
    case 'adminWeeklyActive': return adminMetrics.weeklyActive.map((v,i)=>({day:'D'+(i+1), users:v}))
    case 'adminCompletionTrend': return adminMetrics.completionTrend.map((v,i)=>({week:'W'+(i+1), rate:v}))
    case 'adminCourseDistribution': return adminMetrics.courseDistribution
    case 'adminRatingBuckets': return adminMetrics.ratingBuckets.map((b,i)=>({bucket:b.label, count:b.value}))
    case 'studentProgress': return studentData.progress
    case 'studentTimeSpent': return studentData.timeSpent
    case 'studentTopicMastery': return studentData.topicMastery
    default: return []
  }
}

export function matchChatIntent(role, text) {
  const rules = chatbotPairs[role] || []
  const t = text.toLowerCase()
  for (const r of rules) {
    if (r.q.some(k => t.includes(k))) return r
  }
  return null
}
