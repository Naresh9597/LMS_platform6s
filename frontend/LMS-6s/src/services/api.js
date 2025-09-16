import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api", // backend base URL
});

// Auth
export const login = (credentials) => API.post("/auth/login", credentials);

// Courses
export const getCourses = () => API.get("/courses");
export const addCourse = (course) => API.post("/courses", course);

// Announcements
export const getAnnouncements = () => API.get("/announcements");
