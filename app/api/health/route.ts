import { NextRequest } from 'next/server'
import { createSuccessResponse } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  return createSuccessResponse({ status: 'ok' })
}
