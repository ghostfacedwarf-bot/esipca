import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

// Session duration: 24 hours
const SESSION_DURATION = 24 * 60 * 60 * 1000

// POST - Login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email și parola sunt obligatorii' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email sau parolă incorectă' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Email sau parolă incorectă' },
        { status: 401 }
      )
    }

    // Create session token
    const sessionToken = crypto.randomUUID()
    const expires = new Date(Date.now() + SESSION_DURATION)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires,
      path: '/',
    })

    // Store session data in cookie (simple approach)
    cookieStore.set('admin_user', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('[Admin Auth] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Eroare server' },
      { status: 500 }
    )
  }
}

// DELETE - Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    cookieStore.delete('admin_user')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Admin Auth] Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Eroare la delogare' },
      { status: 500 }
    )
  }
}

// GET - Check session
export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')
    const userCookie = cookieStore.get('admin_user')

    if (!session || !userCookie) {
      return NextResponse.json({ authenticated: false })
    }

    const user = JSON.parse(userCookie.value)

    return NextResponse.json({
      authenticated: true,
      user,
    })
  } catch (error) {
    return NextResponse.json({ authenticated: false })
  }
}
