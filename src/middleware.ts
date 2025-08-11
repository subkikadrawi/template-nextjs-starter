import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('access_token')?.value
    if (!token) return NextResponse.redirect(new URL('/login', req.url))
    try {
      jwt.verify(token, JWT_SECRET)
    } catch (e) {
      // token invalid or expired -> redirect to login
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*'] }
