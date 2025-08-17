import React from 'react'
import { useAuth } from '../context/RoleContext.jsx'
import AdminDashboard from '../components/AdminDashboard.jsx'
import StudentDashboard from '../components/StudentDashboard.jsx'
import ChatDock from '../components/ChatDock.jsx'

export default function Dashboard() {
  const { session } = useAuth()

  if (!session) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">You are not logged in.</h2>
          <p className="text-gray-500 dark:text-gray-400">Please go to Login and sign in.</p>
        </div>
      </div>
    )
  }
  const role = session.role

  return (
    <div className="space-y-4">
      <ChatDock />
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {session.name} 👋</h1>
          <p className="text-gray-500 dark:text-gray-400">This dashboard adapts based on your role.</p>
        </div>
        {/* comment <div className="hidden sm:flex gap-2">
          <span className="badge">Responsive</span>
          <span className="badge">RBAC</span>
          <span className="badge">Charts</span>
        </div>*/}
      </div>

      {role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
    </div>
  )
}
