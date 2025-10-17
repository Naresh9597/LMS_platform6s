const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const connectDB = require("./config/db");

// ✅ Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Import routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const studentCourseRoutes = require("./routes/studentCourseRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

// ✅ Use API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/student", studentCourseRoutes);
app.use("/api/chatbot", chatbotRoutes);

// ✅ Serve React frontend (for Render)
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../frontend/LMS-6s/dist");
  app.use(express.static(buildPath));

  // ⚙️ Express v5 fix: use "/*" instead of "*"
  app.get("/*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// ✅ Default port for Render
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
