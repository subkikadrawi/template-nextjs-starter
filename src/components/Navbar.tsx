'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null)
  useEffect(() => {
    fetch('/api/user', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setUser(d.user?.username || null))
  }, [])

  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold">MyApp</div>
        <div className="space-x-4">
          <Link href="/">Home</Link>
          {user ? <Link href="/dashboard">Dashboard</Link> : <Link href="/login">Login</Link>}
        </div>
      </div>
    </nav>
  )
}
