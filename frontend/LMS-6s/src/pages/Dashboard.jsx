import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard.jsx';
import StudentDashboard from '../components/StudentDashboard.jsx';
import ChatDock from '../components/ChatDock.jsx';

export default function Dashboard() {
  const nav = useNavigate();

  // Read session from localStorage (set by login)
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const name = sessionStorage.getItem('name'); // assuming your backend sends name

    if (!token || !role) {
      nav('/login'); // redirect if not logged in
      return;
    }

    setSession({ token, role, name });
    setLoading(false);
  }, [nav]);

  if (loading) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null; // already redirected
  }

  const { role, name } = session;

  return (
    <div className="space-y-4">
      <ChatDock />

      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {name} 👋</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Track your progress and celebrate every step.
          </p>
        </div>
      </div>

      {role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
    </div>
  );
}
