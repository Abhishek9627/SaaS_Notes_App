import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth, createErrorResponse, createSuccessResponse } from '@/lib/middleware'

export async function GET(request: NextRequest) {
  try {
    const payload = requireAuth(request)

    const notes = await prisma.note.findMany({
      where: {
        tenantId: payload.tenantId,
      },
      include: {
        author: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return createSuccessResponse(notes)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    console.error('Get notes error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = requireAuth(request)
    const { title, content } = await request.json()

    if (!title || !content) {
      return createErrorResponse('Title and content are required', 400)
    }

    // Check note limit for FREE plan
    if (payload.tenantId) {
      const tenant = await prisma.tenant.findUnique({
        where: { id: payload.tenantId },
        include: { _count: { select: { notes: true } } },
      })

      if (tenant?.plan === 'FREE' && tenant._count.notes >= 3) {
        return createErrorResponse('Note limit reached. Upgrade to Pro for unlimited notes.', 403)
      }
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        authorId: payload.userId,
        tenantId: payload.tenantId,
      },
      include: {
        author: {
          select: {
            email: true,
          },
        },
      },
    })

    return createSuccessResponse(note, 201)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    console.error('Create note error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
