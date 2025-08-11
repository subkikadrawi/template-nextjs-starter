import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { compare } from 'bcrypt'
import { signAccessToken, generateRefreshToken, storeRefreshToken } from '@/lib/auth'
import { setAuthCookies, clearAuthCookies } from '@/lib/cookies'

// POST -> login
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { username, password } = body
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  const ok = await compare(password, user.password)
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const accessToken = signAccessToken({ sub: user.id, username })
  const refreshToken = generateRefreshToken()
  await storeRefreshToken(user.id, refreshToken, req.headers.get('user-agent') || undefined)

  const res = NextResponse.json({ success: true })
  setAuthCookies(res, accessToken, refreshToken)
  return res
}

// DELETE -> logout
export async function DELETE() {
  const res = NextResponse.json({ success: true })
  clearAuthCookies(res)
  return res
}
