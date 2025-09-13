import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin, createErrorResponse, createSuccessResponse } from '@/lib/middleware'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const payload = requireAdmin(request)

    // Verify that the admin belongs to the tenant they're trying to upgrade
    const tenant = await prisma.tenant.findUnique({
      where: { slug: params.slug },
    })

    if (!tenant) {
      return createErrorResponse('Tenant not found', 404)
    }

    if (tenant.id !== payload.tenantId) {
      return createErrorResponse('Forbidden: You can only upgrade your own tenant', 403)
    }

    if (tenant.plan === 'PRO') {
      return createErrorResponse('Tenant is already on Pro plan', 400)
    }

    const updatedTenant = await prisma.tenant.update({
      where: { slug: params.slug },
      data: { plan: 'PRO' },
    })

    return createSuccessResponse({
      message: 'Tenant upgraded to Pro successfully',
      tenant: {
        id: updatedTenant.id,
        name: updatedTenant.name,
        slug: updatedTenant.slug,
        plan: updatedTenant.plan,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    if (error instanceof Error && error.message === 'Forbidden: Admin access required') {
      return createErrorResponse('Forbidden: Admin access required', 403)
    }
    console.error('Upgrade tenant error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
