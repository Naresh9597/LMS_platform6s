let { courses, enrolledCourses, completedCourses } = require("../data/mockdata.js");

// Get enrolled courses
const getEnrolledCourses = (req, res) => {
  res.json(enrolledCourses);
};

// Get completed courses
const getCompletedCourses = (req, res) => {
  res.json(completedCourses);
};

// Enroll in a course
const enrollCourse = (req, res) => {
  const { id } = req.params;
  const courseId = parseInt(id, 10);

  const course = courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ error: "Course not found" });

  if (enrolledCourses.some(c => c.id === courseId))
    return res.status(400).json({ error: "Already enrolled" });

  enrolledCourses.push(course);
  res.status(201).json(course);
};

// Mark course as completed
const completeCourse = (req, res) => {
  const { id } = req.params;
  const courseId = parseInt(id, 10);

  const courseIndex = enrolledCourses.findIndex(c => c.id === courseId);
  if (courseIndex === -1) return res.status(400).json({ error: "Not enrolled in this course" });

  const [course] = enrolledCourses.splice(courseIndex, 1);
  completedCourses.push(course);

  res.json(course);
};

module.exports = {
  getEnrolledCourses,
  getCompletedCourses,
  enrollCourse,
  completeCourse,
};
