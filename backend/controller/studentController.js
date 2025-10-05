const StudentData = require("../models/StudentData");

const getStudentData = async (req, res) => {
  try {
    const students = await StudentData.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStudentData };
