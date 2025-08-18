import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/RoleContext.jsx'
import SwitchRoleModal from './SwitchRoleModal.jsx' 
import ClickSpark from '../ReactBits/ClickSpark/ClickSpark.jsx'

export default function Layout({ children }) {
  const { session, logout } = useAuth()
  const [switchOpen, setSwitchOpen] = React.useState(false)
  const nav = useNavigate()

  return (
    <ClickSpark
  sparkColor="#6366F1"
  sparkCount={15}
  sparkRadius={25}
  duration={600}
>
  
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-zinc-900/70 backdrop-blur border-b dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="font-extrabold text-xl">
            Skill<span className="text-indigo-600">Bridge</span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            {session ? (
              <>
                <span className="badge">{session.role.toUpperCase()}</span>
                <span className="hidden sm:inline text-sm opacity-70">
                  Hi, {session.name}
                </span>

                {/* Toggle Switch Role Modal */}
                <button
                  className="btn btn-outline rounded-xl"
                  onClick={() => setSwitchOpen(prev => !prev)} // toggle open/close
                >
                  Switch Role
                </button>

                <button
                  className="btn btn-primary rounded-xl"
                  onClick={() => { logout(); nav('/login') }}
                >
                  Logout
                </button>
              </>
            ) : (
              null
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
    </ClickSpark>
  )
}
