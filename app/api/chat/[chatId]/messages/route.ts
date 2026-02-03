import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { translateText } from '@/lib/translate'

// Admin sends a reply
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json({ error: 'Missing message' }, { status: 400 })
    }

    // Get chat to find visitor language
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    })

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
    }

    // Translate admin's message (Romanian) to visitor's language
    const translation = await translateText(message, chat.visitorLang, 'ro')

    // Save message
    const chatMessage = await prisma.chatMessage.create({
      data: {
        chatId,
        sender: 'admin',
        originalText: message,
        translatedText: translation.translatedText,
        originalLang: 'ro',
      },
    })

    // Reset unread count since admin is responding
    await prisma.chat.update({
      where: { id: chatId },
      data: { unreadCount: 0 },
    })

    return NextResponse.json({
      success: true,
      message: chatMessage,
    })
  } catch (error) {
    console.error('Admin reply error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Get messages for a chat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params

    const messages = await prisma.chatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
