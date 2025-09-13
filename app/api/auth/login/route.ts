import { NextRequest } from 'next/server'
import { authenticateUser, generateToken } from '@/lib/auth'
import { createErrorResponse, createSuccessResponse } from '@/lib/middleware'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return createErrorResponse('Email and password are required', 400)
    }

    const user = await authenticateUser(email, password)
    if (!user) {
      return createErrorResponse('Invalid credentials', 401)
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      tenantSlug: user.tenantSlug,
    })

    return createSuccessResponse({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantSlug: user.tenantSlug,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
