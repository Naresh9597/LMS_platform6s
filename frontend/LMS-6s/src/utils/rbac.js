const permissions = {
  admin: ['orgStats','coursesTable','leaderboard','announcements','courseRatings','completionChart','distributionChart','ratingBreakdown','trending','kpis'],
  student: ['progressChart','deadlinesTable','quizTable','timeSpentChart','topicMasteryChart','announcements','kpis']
}
export const can = (role, module) => (permissions[role] || []).includes(module)
