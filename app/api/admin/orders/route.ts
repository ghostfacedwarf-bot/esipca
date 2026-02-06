import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import prisma from '@/lib/prisma'

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session
}

// GET - List orders with stats
export async function GET(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}
    if (status && status !== 'all') {
      where.status = status
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { customerEmail: { contains: search } },
        { customerPhone: { contains: search } },
      ]
    }

    // Fetch orders
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    // Fetch stats
    const allOrders = await prisma.order.findMany({
      select: { status: true, estimatedTotal: true },
    })

    const stats = {
      total: allOrders.length,
      pending: 0,
      confirmed: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0,
    }

    for (const order of allOrders) {
      const s = order.status as keyof typeof stats
      if (s in stats && typeof stats[s] === 'number' && s !== 'total' && s !== 'totalRevenue') {
        (stats[s] as number)++
      }
      if (order.status !== 'cancelled' && order.estimatedTotal) {
        stats.totalRevenue += order.estimatedTotal
      }
    }

    return NextResponse.json({ orders, total, stats })
  } catch (error) {
    console.error('[ADMIN ORDERS] Error fetching orders:', error)
    return NextResponse.json(
      { message: 'Eroare la incarcarea comenzilor' },
      { status: 500 }
    )
  }
}

// PATCH - Update order status/notes
const updateSchema = z.object({
  orderId: z.string(),
  status: z.enum(['pending', 'confirmed', 'shipped', 'completed', 'cancelled']).optional(),
  notes: z.string().optional(),
})

export async function PATCH(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validated = updateSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { message: 'Date invalide', errors: validated.error.flatten() },
        { status: 400 }
      )
    }

    const { orderId, status, notes } = validated.data

    const data: Record<string, unknown> = {}
    if (status !== undefined) data.status = status
    if (notes !== undefined) data.notes = notes

    const updated = await prisma.order.update({
      where: { id: orderId },
      data,
      include: { items: true },
    })

    console.log(`[ADMIN ORDERS] Updated order ${updated.orderNumber}: ${JSON.stringify(data)}`)

    return NextResponse.json({ order: updated })
  } catch (error) {
    console.error('[ADMIN ORDERS] Error updating order:', error)
    return NextResponse.json(
      { message: 'Eroare la actualizarea comenzii' },
      { status: 500 }
    )
  }
}
