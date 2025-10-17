import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function Login() {

  const nav = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [student, setStudent] = useState({ username: "", password: "" });
  const [admin, setAdmin] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");

  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const handleChange = (e, role) => {
    const { name, value } = e.target;
    role === "student"
      ? setStudent((s) => ({ ...s, [name]: value }))
      : setAdmin((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e, role) => {
    e.preventDefault();
    setErr("");

    const creds = role === "student" ? student : admin;

    try {
      const res = await fetch("https://lms-mern-s8k6.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: creds.username,
          password: creds.password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.error || "Login failed");
        return;
      }

      // ✅ Store token + role in localStorage
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("name", data.name);
      sessionStorage.setItem("role", data.role);

      // ✅ Navigate based on role
      if (data.role === "student") nav("/dashboard");
      else if (data.role === "admin") nav("/dashboard");
    } catch (error) {
      setErr("Server error. Please try again later.");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="relative w-[700px] max-w-full h-[460px] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* STUDENT PANEL */}
        <div
          className={[
            "absolute inset-y-0 left-0 w-1/2 flex items-center justify-center p-12",
            "transform-gpu transition-all duration-700 ease-in-out",
            isAdmin
              ? "translate-x-full opacity-0 pointer-events-none"
              : "translate-x-0 opacity-100",
          ].join(" ")}
          aria-hidden={isAdmin}
        >
          <form
            onSubmit={(e) => handleSubmit(e, "student")}
            className="flex flex-col w-full text-center"
          >
            <h1 className="font-bold text-2xl mb-4">Student Login</h1>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={student.username}
              onChange={(e) => handleChange(e, "student")}
              className="bg-gray-200 rounded px-4 py-3 mb-3 outline-none"
            />
            <div className="relative mb-3">
              <input
                type={showStudentPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={student.password}
                onChange={(e) => handleChange(e, "student")}
                className="bg-gray-200 rounded px-4 py-3 w-full outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowStudentPassword(!showStudentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showStudentPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
            {err && <div className="text-red-600 text-sm mb-3">{err}</div>}
            <button
              type="submit"
              className="rounded-full bg-indigo-600 text-white font-bold py-3 px-8 uppercase text-sm tracking-wider hover:bg-indigo-600 transition"
            >
              Login
            </button>
          </form>
        </div>

        {/* ADMIN PANEL */}
        <div
          className={[
            "absolute inset-y-0 right-0 w-1/2 flex items-center justify-center p-12",
            "transform-gpu transition-all duration-700 ease-in-out",
            isAdmin
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 pointer-events-none",
          ].join(" ")}
          aria-hidden={!isAdmin}
        >
          <form
            onSubmit={(e) => handleSubmit(e, "admin")}
            className="flex flex-col w-full text-center"
          >
            <h1 className="font-bold text-2xl mb-4">Admin Login</h1>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={admin.username}
              onChange={(e) => handleChange(e, "admin")}
              className="bg-gray-200 rounded px-4 py-3 mb-3 outline-none"
            />
            <div className="relative mb-3">
              <input
                type={showAdminPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={admin.password}
                onChange={(e) => handleChange(e, "admin")}
                className="bg-gray-200 rounded px-4 py-3 w-full outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showAdminPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
            {err && <div className="text-red-600 text-sm mb-3">{err}</div>}
            <button
              type="submit"
              className="rounded-full bg-indigo-600 text-white font-bold py-3 px-8 uppercase text-sm tracking-wider hover:bg-indigo-600 transition"
            >
              Login
            </button>
          </form>
        </div>

        {/* OVERLAY */}
        <div
          className={[
            "absolute top-0 left-1/2 w-1/2 h-full overflow-hidden z-10",
            "transform-gpu transition-transform duration-700 ease-in-out",
            isAdmin ? "-translate-x-full" : "translate-x-0",
          ].join(" ")}
        >
          <div
            className={[
              "absolute left-[-100%] w-[200%] h-full flex",
              "transform-gpu transition-transform duration-700 ease-in-out",
              isAdmin ? "translate-x-1/2" : "translate-x-0",
            ].join(" ")}
          >
            <div className="w-1/2 px-10 flex flex-col items-center justify-center text-center bg-gradient-to-r from-indigo-500 to-indigo-500 text-white">
              <h1 className="text-3xl font-bold">Welcome Back!</h1>
              <p className="text-sm my-5">Login as Student to access your portal</p>
              <button
                onClick={() => setIsAdmin(false)}
                className="rounded-full border border-white px-8 py-3 uppercase text-sm font-bold"
              >
                Student Login
              </button>
            </div>

            <div className="w-1/2 px-10 flex flex-col items-center justify-center text-center bg-gradient-to-r from-indigo-500 to-indigo-500 text-white">
              <h1 className="text-3xl font-bold">Hello, Admin!</h1>
              <p className="text-sm my-5">Login with your credentials</p>
              <button
                onClick={() => setIsAdmin(true)}
                className="rounded-full border border-white px-8 py-3 uppercase text-sm font-bold"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DEMO CREDENTIALS */}
      <div className="mt-2 text-xs text-gray-500 text-center absolute bottom-2">
        Demo credentials:<br />
        Admin → <code>admin / admin123</code><br />
        Student → <code>student / student123</code>
      </div>
    </div>
  );
}
