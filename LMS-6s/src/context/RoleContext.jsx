import React, { createContext, useContext, useEffect, useState } from 'react'
import { users } from '../data/mock.js'

const RoleContext = createContext()
export const RoleProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const raw = sessionStorage.getItem('session')
    return raw ? JSON.parse(raw) : null
  })
  useEffect(() => { sessionStorage.setItem('session', JSON.stringify(session)) }, [session])

  const login = (username, password, role) => {
    const user = users.find(u => u.username === username && u.password === password && u.role === role)
    if (!user) return false
    setSession({ username: user.username, role: user.role, name: user.name })
    return true
  }
  const logout = () => setSession(null)

  // Switch role by re-authenticating with another role's creds
  const switchRole = (username, password, newRole) => {
    const ok = login(username, password, newRole)
    return ok
  }

  return (
    <RoleContext.Provider value={{ session, login, logout, switchRole }}>
      {children}
    </RoleContext.Provider>
  )
}
export const useAuth = () => useContext(RoleContext)
