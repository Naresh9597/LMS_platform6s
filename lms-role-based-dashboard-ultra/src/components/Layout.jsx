import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/RoleContext.jsx'
import SwitchRoleModal from './SwitchRoleModal.jsx'
import useDarkMode from '../hooks/useDarkMode.js'

export default function Layout({ children }) {
  const { session, logout } = useAuth()
  const [dark, setDark] = useDarkMode()
  const [switchOpen, setSwitchOpen] = React.useState(false)
  const nav = useNavigate()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-zinc-900/70 backdrop-blur border-b dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="font-extrabold text-xl">LMS<span className="text-indigo-600">Ultra</span></Link>
          <div className="ml-auto flex items-center gap-2">
            {session ? (
              <>
                <span className="badge">{session.role.toUpperCase()}</span>
                <span className="hidden sm:inline text-sm opacity-70">Hi, {session.name}</span>
                <button className="btn btn-outline rounded-xl" onClick={() => setSwitchOpen(true)}>Switch Role</button>
                <button
                  className="btn btn-primary rounded-xl"
                  onClick={() => { logout(); nav('/login') }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary rounded-xl">Login</Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Switch Role Modal */}
      <SwitchRoleModal open={switchOpen} onClose={() => setSwitchOpen(false)} />
    </div>
  )
}
