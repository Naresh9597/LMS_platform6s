import React from "react";
import { useNavigate } from "react-router-dom";
import StudentCourses from "../components/StudentCourses";
import AdminCourses from "../components/AdminCourses";
import { useAuth } from "../context/RoleContext.jsx";
import ChatDock from '../components/ChatDock.jsx';

export default function CoursesPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
const role = session?.role || sessionStorage.getItem("role");

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Courses</h1>
        <button
          onClick={() => navigate("/dashboard")}
          title="Go back to Dashboard"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
        >
          Exit
        </button>
      </div>

      {role === "student" ? <StudentCourses /> : <AdminCourses />}

      <div className="fixed bottom-4 right-4">
        <ChatDock />
      </div>
    </div>
  );
}
