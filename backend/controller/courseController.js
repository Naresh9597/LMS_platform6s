let { courses } = require("../data/mockdata.js");

// GET all courses
const getCourses = (req, res) => {
  res.json(courses);
};

// ADD new course
const addCourse = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Course name required" });

  const newCourse = { id: Date.now(), name };
  courses.push(newCourse);
  res.status(201).json(newCourse);
};

// DELETE course
const deleteCourse = (req, res) => {
  const { id } = req.params;
  const courseId = parseInt(id, 10);

  const index = courses.findIndex((c) => c.id === courseId);
  if (index === -1) return res.status(404).json({ error: "Course not found" });

  courses.splice(index, 1);
  res.json({ message: "Course deleted" });
};

module.exports = { getCourses, addCourse, deleteCourse };
