import React, { useState } from 'react'
import { useAuth } from '../context/RoleContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function SwitchRoleModal({ open, onClose }) {
  const { switchRole } = useAuth()
  const [desired, setDesired] = useState('student')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  if (!open) return null

  const handleConfirm = () => {
    setErr('')
    const ok = switchRole(username, password, desired)
    if (!ok) { setErr('Invalid credentials for the selected role.'); return }
    onClose()
    nav('/dashboard')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl card overflow-hidden shadow-glass">
        <div className="px-4 py-3 border-b dark:border-white/10 flex items-center justify-between">
          <h3 className="font-semibold">Switch Role</h3>
          <button className="btn btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="p-4 space-y-3">
          <label className="block text-sm font-medium">Desired Role</label>
          <select className="select w-full" value={desired} onChange={e => setDesired(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>

          <div className="text-sm text-gray-500 dark:text-gray-400">Re-authentication required to switch roles.</div>

          <div className="grid gap-2">
            <input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
            <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          {err && <div className="text-red-600 text-sm">{err}</div>}

          <div className="pt-2 flex justify-end gap-2">
            <button className="btn btn-ghost rounded-xl" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary rounded-xl" onClick={handleConfirm}>Confirm & Switch</button>
          </div>
        </div>
      </div>
    </div>
  )
}
