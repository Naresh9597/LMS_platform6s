const mongoose = require('mongoose');

const StudentDataSchema = new mongoose.Schema({
  name: String,
  progress: [{ week: String, score: Number }],
  timeSpent: [{ week: String, minutes: Number }],
  topicMastery: [{ topic: String, mastery: Number }],
  deadlines: [{ id: Number, course: String, task: String, due: String }],
  quizHistory: [{ id: Number, course: String, score: Number, date: String }],
  announcements: [{ id: Number, title: String, date: String, text: String }],
  // In StudentDataSchema:
enrolledCourses: [{ id: Number, title: String, enrollments: Number, completion: Number, rating: Number }],
completedCourses: [{ id: Number, title: String, enrollments: Number, completion: Number, rating: Number }]

});

module.exports = mongoose.model('StudentData', StudentDataSchema);
