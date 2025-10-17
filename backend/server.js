const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require('./config/db');
connectDB();

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const studentCourseRoutes = require("./routes/studentCourseRoutes");
const chatbotRoutes =require("./routes/chatbotRoutes");


const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/student/", studentCourseRoutes);
app.use('/api/chatbot', chatbotRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import path from "path";
import { fileURLToPath } from "url";
//import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 // make sure app is defined

// Serve React build files
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../frontend/LMS6s/build"); // updated path
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}
