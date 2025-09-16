const { studentData } = require("../data/mockdata");

const getStudentData = (req, res) => {
  res.json(studentData);
};

module.exports = { getStudentData };
