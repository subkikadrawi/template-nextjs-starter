import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret'
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES_IN || '15m'
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

export function signAccessToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRES })
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET)
}

export function generateRefreshToken() {
  // random token (store hash in DB)
  return crypto.randomBytes(64).toString('hex')
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export async function storeRefreshToken(userId: string, token: string, userAgent?: string) {
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + ms(REFRESH_EXPIRES))
  return prisma.refreshToken.create({ data: { tokenHash, userId, expiresAt, userAgent } })
}

export async function rotateRefreshToken(oldToken: string, userId: string, userAgent?: string) {
  const oldHash = hashToken(oldToken)
  // revoke old
  await prisma.refreshToken.updateMany({ where: { tokenHash: oldHash, revoked: false }, data: { revoked: true } })
  const newToken = generateRefreshToken()
  await storeRefreshToken(userId, newToken, userAgent)
  return newToken
}

export async function validateRefreshToken(token: string) {
  const tokenHash = hashToken(token)
  const rec = await prisma.refreshToken.findUnique({ where: { tokenHash }, include: { user: true } })
  if (!rec) return null
  if (rec.revoked) return null
  if (rec.expiresAt < new Date()) return null
  return rec
}

function ms(duration: string) {
  // naive parser for '7d', '15m'
  if (duration.endsWith('d')) return parseInt(duration) * 24 * 60 * 60 * 1000
  if (duration.endsWith('m')) return parseInt(duration) * 60 * 1000
  if (duration.endsWith('h')) return parseInt(duration) * 60 * 60 * 1000
  return parseInt(duration) // fallback ms
}
