import { NextResponse } from 'next/server'

export function setAuthCookies(res: NextResponse, accessToken: string, refreshToken: string) {
  const secure = (process.env.COOKIE_SECURE === 'true') || (process.env.NODE_ENV === 'production')
  res.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure,
    sameSite: process.env.COOKIE_SAMESITE || 'Strict',
    path: '/',
    maxAge: 60 * 15 // 15 min
  })
  res.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure,
    sameSite: process.env.COOKIE_SAMESITE || 'Strict',
    path: '/api/auth/refresh',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set('access_token', '', { maxAge: 0, path: '/' })
  res.cookies.set('refresh_token', '', { maxAge: 0, path: '/api/auth/refresh' })
}
