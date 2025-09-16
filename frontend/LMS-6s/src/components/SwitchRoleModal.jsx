import React, { useState } from "react";
import { useAuth } from "../context/RoleContext.jsx";
import { useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { motion } from "framer-motion";

export default function SwitchRoleModal({ open, onClose }) {
  const { switchRole } = useAuth();
  const [desired, setDesired] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  if (!open) return null;

  const handleConfirm = () => {
    setErr("");
    const ok = switchRole(username, password, desired);
    if (!ok) {
      setErr("Invalid credentials for the selected role.");
      return;
    }
    onClose();
    nav("/dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose} // click outside closes modal
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl border border-gray-300"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-black">Switch Role</h3>
          <button
            onClick={onClose}
            className="text-black text-xl font-bold hover:text-indigo-500 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-black font-medium">Desired Role</label>
          <select
            className="w-full px-4 py-2 rounded border border-gray-300 text-black"
            value={desired}
            onChange={(e) => setDesired(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>

          <input
            className="w-full px-4 py-2 rounded border border-gray-300 text-black"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 pr-10 rounded border border-gray-300 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </button>
          </div>

          {err && <div className="text-red-600 text-sm">{err}</div>}

          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded border border-gray-400 text-black hover:bg-gray-100 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 transition"
              onClick={handleConfirm}
            >
              Confirm & Switch
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
