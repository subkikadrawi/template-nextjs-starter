import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const c = cookies()
  const token = c.get('access_token')?.value
  if (!token) redirect('/login')

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold">Dashboard (Protected)</h2>
      <p className="mt-3">Server-rendered protected content.</p>
    </div>
  )
}
