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
app.use("/api/student/courses", studentCourseRoutes);
app.use('/api/chatbot', chatbotRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
