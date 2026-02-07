import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const status: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    app: 'running',
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
    },
    mysql2: 'checking...',
    prisma: 'checking...',
    errors: [] as string[],
  }

  // Test 1: Raw mysql2 connection
  try {
    if (!process.env.DATABASE_URL) {
      (status.errors as string[]).push('DATABASE_URL not set')
    } else {
      const connection = await mysql.createConnection(process.env.DATABASE_URL)
      const [rows] = await connection.execute('SELECT COUNT(*) as count FROM Product')
      const count = (rows as Array<{ count: number }>)[0]?.count || 0
      const [userRows] = await connection.execute('SELECT COUNT(*) as count FROM `User`')
      const userCount = (userRows as Array<{ count: number }>)[0]?.count || 0

      status.mysql2 = {
        connected: true,
        productsCount: count,
        usersCount: userCount,
      }
      await connection.end()
    }
  } catch (dbError: unknown) {
    const msg = dbError instanceof Error ? dbError.message : 'unknown'
    status.mysql2 = { connected: false, error: msg };
    (status.errors as string[]).push(`mysql2: ${msg}`)
  }

  // Test 2: Prisma connection (this is what admin/auth uses)
  try {
    await prisma.$queryRaw`SELECT 1`
    const userCount = await prisma.user.count()
    status.prisma = {
      connected: true,
      userCount,
    }
  } catch (prismaError: unknown) {
    const msg = prismaError instanceof Error ? prismaError.message : 'unknown'
    status.prisma = { connected: false, error: msg };
    (status.errors as string[]).push(`prisma: ${msg}`)
  }

  const hasErrors = (status.errors as string[]).length > 0
  return NextResponse.json(status, { status: hasErrors ? 500 : 200 })
}
