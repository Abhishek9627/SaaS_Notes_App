import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, JWTPayload } from './auth'

export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

export function authenticateRequest(request: NextRequest): JWTPayload | null {
  const token = getAuthToken(request)
  if (!token) {
    return null
  }
  return verifyToken(token)
}

export function requireAuth(request: NextRequest): JWTPayload {
  const payload = authenticateRequest(request)
  if (!payload) {
    throw new Error('Unauthorized')
  }
  return payload
}

export function requireAdmin(request: NextRequest): JWTPayload {
  const payload = requireAuth(request)
  if (payload.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required')
  }
  return payload
}

export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status })
}
