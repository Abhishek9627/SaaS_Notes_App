import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth, createErrorResponse, createSuccessResponse } from '@/lib/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = requireAuth(request)

    const note = await prisma.note.findFirst({
      where: {
        id: params.id,
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

    if (!note) {
      return createErrorResponse('Note not found', 404)
    }

    return createSuccessResponse(note)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    console.error('Get note error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = requireAuth(request)
    const { title, content } = await request.json()

    if (!title || !content) {
      return createErrorResponse('Title and content are required', 400)
    }

    const note = await prisma.note.findFirst({
      where: {
        id: params.id,
        tenantId: payload.tenantId,
      },
    })

    if (!note) {
      return createErrorResponse('Note not found', 404)
    }

    const updatedNote = await prisma.note.update({
      where: { id: params.id },
      data: {
        title,
        content,
      },
      include: {
        author: {
          select: {
            email: true,
          },
        },
      },
    })

    return createSuccessResponse(updatedNote)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    console.error('Update note error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = requireAuth(request)

    const note = await prisma.note.findFirst({
      where: {
        id: params.id,
        tenantId: payload.tenantId,
      },
    })

    if (!note) {
      return createErrorResponse('Note not found', 404)
    }

    await prisma.note.delete({
      where: { id: params.id },
    })

    return createSuccessResponse({ message: 'Note deleted successfully' })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return createErrorResponse('Unauthorized', 401)
    }
    console.error('Delete note error:', error)
    return createErrorResponse('Internal server error', 500)
  }
}
