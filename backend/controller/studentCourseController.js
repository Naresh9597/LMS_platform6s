const StudentData = require("../models/StudentData");

const getEnrolledCourses = async (req, res) => {
  try {
    const student = await StudentData.findOne();
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

    // ✅ prevent duplicate enrollment
    if (student.enrolledCourses.some(c => c._id == id)) {
      return res.status(400).json({ error: "Already enrolled" });
    }

    // ✅ fetch actual course details
    const Course = require("../models/Course");
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // ✅ push with consistent structure
    student.enrolledCourses.push({
      _id: course._id,
      title: course.title,
    });

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

    const index = student.enrolledCourses.findIndex(c => c._id == id);
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
