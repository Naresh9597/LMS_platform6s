// routes/courseRouter.js
const express = require("express");
const { getCourses, addCourse, deleteCourse } = require("../controller/courseController");

const router = express.Router();

router.get("/", getCourses);
router.post("/", addCourse);
router.delete("/:id", deleteCourse);

module.exports = router;
