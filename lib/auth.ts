import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

export interface JWTPayload {
  userId: string
  email: string
  role: 'ADMIN' | 'MEMBER'
  tenantId: string
  tenantSlug: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      tenant: true,
    },
  })

  if (!user || !(await verifyPassword(password, user.password))) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
    tenantSlug: user.tenant.slug,
  }
}
