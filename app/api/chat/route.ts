import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { translateText, detectLanguage } from '@/lib/translate'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// WhatsApp notification number
const WHATSAPP_NUMBER = '40722292519'

// Create or get chat session
export async function POST(request: NextRequest) {
  try {
    // Rate limit chat messages: 20 per minute per IP
    const ip = getClientIp(request)
    const rl = rateLimit(`chat:${ip}`, { limit: 20, windowSeconds: 60 })
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Prea multe mesaje. Incercati din nou mai tarziu.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { sessionId, message, visitorName, visitorEmail } = body

    if (!sessionId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find or create chat
    let chat = await prisma.chat.findUnique({
      where: { sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    })

    // Detect language
    const detectedLang = await detectLanguage(message)

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          sessionId,
          visitorName,
          visitorEmail,
          visitorLang: detectedLang !== 'unknown' ? detectedLang : 'ro',
          unreadCount: 1,
        },
        include: { messages: true },
      })
    } else {
      // Update chat
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          visitorName: visitorName || chat.visitorName,
          visitorEmail: visitorEmail || chat.visitorEmail,
          visitorLang: detectedLang !== 'unknown' ? detectedLang : chat.visitorLang,
          unreadCount: { increment: 1 },
          status: 'active',
        },
      })
    }

    // Translate message to Romanian for admin
    const translation = await translateText(message, 'ro', detectedLang !== 'unknown' ? detectedLang : 'auto')

    // Save message
    const chatMessage = await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        sender: 'visitor',
        originalText: message,
        translatedText: translation.translatedText,
        originalLang: translation.detectedLang,
      },
    })

    // Generate WhatsApp notification link
    const whatsappMessage = `📩 Mesaj nou pe site!\n\nDe la: ${visitorName || 'Vizitator'}\nLimba: ${translation.detectedLang.toUpperCase()}\n\n"${translation.translatedText}"\n\n→ Răspunde din Admin Panel`
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`

    return NextResponse.json({
      success: true,
      chatId: chat.id,
      message: chatMessage,
      whatsappNotification: whatsappLink,
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Get chat by session
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: { sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!chat) {
      return NextResponse.json({ chat: null, messages: [] })
    }

    // Mark admin messages as read
    await prisma.chatMessage.updateMany({
      where: { chatId: chat.id, sender: 'admin', isRead: false },
      data: { isRead: true },
    })

    return NextResponse.json({
      chat,
      messages: chat.messages,
    })
  } catch (error) {
    console.error('Chat fetch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
