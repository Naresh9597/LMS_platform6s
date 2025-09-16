const express = require("express");
const router = express.Router();
const { login, authenticate } = require("../controller/authController");

router.post("/login", login);

router.get("/admin/metrics", authenticate, (req, res) => {
  // req.user contains username, role, name
  res.json({
    activeUsers: 120,
    completionRate: 85,
    avgSessionMins: 45,
    newSignups: 10,
    completionTrend: [{ week: 1, rate: 80 }, { week: 2, rate: 85 }],
  });
});

module.exports = router;
