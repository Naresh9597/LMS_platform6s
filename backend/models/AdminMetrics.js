const mongoose = require('mongoose');

const AdminMetricsSchema = new mongoose.Schema({
  activeUsers: Number,
  newSignups: Number,
  churnRate: Number,
  completionRate: Number,
  avgSessionMins: Number,
  weeklyActive: [Number],
  completionTrend: [Number],
  courseDistribution: [{ name: String, value: Number }],
  topCourses: [{ name: String, enrollments: Number, rating: Number }],
  courses: [{ id: Number, title: String, enrollments: Number, completion: Number, rating: Number }],
  leaderboard: [{ id: Number, name: String, score: Number }],
  announcements: [{ id: Number, title: String, date: String, text: String }],
  ratingBuckets: [{ label: String, value: Number }]
});

module.exports = mongoose.model('AdminMetrics', AdminMetricsSchema);
