const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const connectDB = require("./config/db");

// Connect to DB
connectDB();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const studentCourseRoutes = require("./routes/studentCourseRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/student", studentCourseRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../frontend/LMS-6s/dist");
  app.use(express.static(buildPath));

  // ✅ FIXED: Wildcard route syntax for Express 5
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
