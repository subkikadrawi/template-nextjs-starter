import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || ''
    const match = cookieHeader.match(/access_token=([^;]+)/)
    const token = match ? match[1] : null
    if (!token) return NextResponse.json({ user: null })
    const payload = jwt.verify(token, JWT_SECRET) as any
    return NextResponse.json({ user: { id: payload.sub, username: payload.username } })
  } catch (e) {
    return NextResponse.json({ user: null })
  }
}
