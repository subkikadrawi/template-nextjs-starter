import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateRefreshToken, rotateRefreshToken, signAccessToken } from '@/lib/auth'
import { setAuthCookies, clearAuthCookies } from '@/lib/cookies'

export async function POST(req: NextRequest) {
  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.match(/refresh_token=([^;]+)/)
  const refreshToken = match ? match[1] : null
  if (!refreshToken) return NextResponse.json({ error: 'No token' }, { status: 401 })

  const rec = await validateRefreshToken(refreshToken)
  if (!rec) {
    const res = NextResponse.json({ error: 'Invalid refresh' }, { status: 401 })
    clearAuthCookies(res)
    return res
  }

  // rotate
  const newRefresh = await rotateRefreshToken(refreshToken, rec.userId, req.headers.get('user-agent') || undefined)
  const accessToken = signAccessToken({ sub: rec.userId, username: rec.user.username })

  const res = NextResponse.json({ success: true })
  setAuthCookies(res, accessToken, newRefresh)
  return res
}
