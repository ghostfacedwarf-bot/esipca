import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const secretToken = process.env.INIT_DB_TOKEN

  if (!secretToken || token !== secretToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      return NextResponse.json({ error: 'ADMIN_PASSWORD not set in env' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    // Try to update existing user
    const existing = await prisma.user.findFirst({ where: { email: adminEmail } })

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { password: hashedPassword },
      })
      return NextResponse.json({ success: true, message: `Password reset for ${adminEmail}` })
    }

    // Create user if not exists
    const { createId } = await import('@paralleldrive/cuid2')
    await prisma.user.create({
      data: {
        id: createId(),
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin',
      },
    })

    return NextResponse.json({ success: true, message: `User created: ${adminEmail}` })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
