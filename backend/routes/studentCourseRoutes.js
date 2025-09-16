const express = require("express");
const {
  getEnrolledCourses,
  getCompletedCourses,
  enrollCourse,
  completeCourse,
} = require("../controller/studentCourseController.js");

const router = express.Router();

router.get("/enrolled", getEnrolledCourses);
router.get("/completed", getCompletedCourses);
router.post("/enroll/:id", enrollCourse);
router.post("/complete/:id", completeCourse);

module.exports = router;
