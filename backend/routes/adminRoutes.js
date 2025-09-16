const express = require("express");
const { getAdminMetrics } = require("../controller/adminController");

const router = express.Router();

router.get("/metrics", getAdminMetrics);

module.exports = router;
