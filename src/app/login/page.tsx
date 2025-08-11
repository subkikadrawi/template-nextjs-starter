'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function submit(e: any) {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }), credentials: 'include' })
      if (!res.ok) throw new Error('Login failed')
      Swal.fire({ icon: 'success', title: 'Login successful' })
      router.push('/dashboard')
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Login failed', text: err.message })
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="flex flex-col gap-2">
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" className="p-2 border" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" className="p-2 border" />
        <button className="mt-3 bg-blue-600 text-white px-4 py-2">Login</button>
      </form>
    </div>
  )
}
