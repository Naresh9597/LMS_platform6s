const StudentData = require("../models/StudentData");

const getEnrolledCourses = async (req, res) => {
  try {
    const student = await StudentData.findOne(); // pick first student for demo
    res.json(student ? student.enrolledCourses : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCompletedCourses = async (req, res) => {
  try {
    const student = await StudentData.findOne();
    res.json(student ? student.completedCourses : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const enrollCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await StudentData.findOne();
    if (!student) return res.status(404).json({ error: "Student not found" });

    if (student.enrolledCourses.some(c => c.id == id)) {
      return res.status(400).json({ error: "Already enrolled" });
    }

    const course = student.enrolledCourses.find(c => c.id == id) || { id: Number(id), title: "New Course" };
    student.enrolledCourses.push(course);
    await student.save();

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const completeCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await StudentData.findOne();
    if (!student) return res.status(404).json({ error: "Student not found" });

    const index = student.enrolledCourses.findIndex(c => c.id == id);
    if (index === -1) return res.status(400).json({ error: "Not enrolled in this course" });

    const [course] = student.enrolledCourses.splice(index, 1);
    student.completedCourses.push(course);
    await student.save();

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getEnrolledCourses,
  getCompletedCourses,
  enrollCourse,
  completeCourse,
};
