import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/RoleContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const [role, setRole] = useState('admin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    setErr('')
    const ok = login(username, password, role)
    if (!ok) { setErr('Invalid credentials for selected role. Try admin/admin123 or student/student123.'); return }
    nav('/dashboard')
  }

  return (
    <div className="min-h-[70vh] grid place-items-center">
      <div className="card p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Use the mock credentials to sign in.</p>
        <form className="mt-4 grid gap-3" onSubmit={submit}>
          <label className="block text-sm font-medium">Role</label>
          <select className="select w-full" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>
          <input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button className="btn btn-primary rounded-xl w-full mt-2">Sign In</button>
        </form>

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Demo credentials:<br/>
          Admin → <code>admin / admin123</code><br/>
          Student → <code>student / student123</code>
        </div>
      </div>
    </div>
  )
}
