const AdminMetrics = require("../models/AdminMetrics");

const getCourses = async (req, res) => {
  try {
    const metrics = await AdminMetrics.findOne();
    res.json(metrics ? metrics.courses : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addCourse = async (req, res) => {
  const { title, enrollments = 0, completion = 0, rating = 0 } = req.body;
  if (!title) return res.status(400).json({ error: "Course title required" });

  try {
    const metrics = await AdminMetrics.findOne();
    if (!metrics) return res.status(404).json({ error: "Admin metrics not found" });

    const newCourse = { id: Date.now(), title, enrollments, completion, rating };
    metrics.courses.push(newCourse);
    await metrics.save();

    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const metrics = await AdminMetrics.findOne();
    if (!metrics) return res.status(404).json({ error: "Admin metrics not found" });

    const courseIndex = metrics.courses.findIndex(c => c.id == id);
    if (courseIndex === -1) return res.status(404).json({ error: "Course not found" });

    metrics.courses.splice(courseIndex, 1);
    await metrics.save();

    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCourses, addCourse, deleteCourse };
