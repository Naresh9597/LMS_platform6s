const express = require("express");
const { getStudentData } = require("../controller/studentController");

const router = express.Router();

router.get("/data", getStudentData);

module.exports = router;
