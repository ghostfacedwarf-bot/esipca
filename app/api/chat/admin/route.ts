import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get all chats for admin
export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status') || 'all'

    const where = status === 'all' ? {} : { status }

    const chats = await prisma.chat.findMany({
      where,
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Get last message
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ chats })
  } catch (error) {
    console.error('Admin chats error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Update chat status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { chatId, status } = body

    if (!chatId || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const chat = await prisma.chat.update({
      where: { id: chatId },
      data: { status },
    })

    return NextResponse.json({ success: true, chat })
  } catch (error) {
    console.error('Chat update error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Delete chat
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { chatId } = body

    if (!chatId) {
      return NextResponse.json({ error: 'Missing chatId' }, { status: 400 })
    }

    // Delete chat (messages will cascade delete due to relation)
    await prisma.chat.delete({
      where: { id: chatId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Chat delete error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
