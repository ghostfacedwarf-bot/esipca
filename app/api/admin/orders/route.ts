import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import mysql from 'mysql2/promise'

async function getConnection() {
  return mysql.createConnection(process.env.DATABASE_URL || '')
}

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session
}

interface OrderRow {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string | null
  customerCity: string | null
  customerCounty: string | null
  customerPostal: string | null
  customerCountry: string | null
  message: string | null
  estimatedTotal: number | null
  status: string
  paymentMethod: string
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

interface OrderItemRow {
  id: string
  orderId: string
  productId: string
  variantId: string | null
  quantity: number
  price: number
  productName: string
  variantName: string | null
  sku: string | null
  imageUrl: string | null
  attributes: string | null
  createdAt: Date
}

interface StatsRow {
  status: string
  estimatedTotal: number | null
}

/** Parse the attributes JSON field safely */
function parseAttributes(raw: unknown): unknown {
  if (raw === null || raw === undefined) return null
  // mysql2 may return JSON columns as parsed objects already
  if (typeof raw === 'object') return raw
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return raw
    }
  }
  return raw
}

/** Attach items array to each order */
function assembleOrdersWithItems(orders: OrderRow[], items: OrderItemRow[]) {
  const itemsByOrderId = new Map<string, OrderItemRow[]>()
  for (const item of items) {
    const list = itemsByOrderId.get(item.orderId) || []
    list.push({
      ...item,
      attributes: parseAttributes(item.attributes) as string | null,
    })
    itemsByOrderId.set(item.orderId, list)
  }

  return orders.map((order) => ({
    ...order,
    items: itemsByOrderId.get(order.id) || [],
  }))
}

// GET - List orders with stats
export async function GET(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  let connection: mysql.Connection | null = null

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = (page - 1) * limit

    connection = await getConnection()

    // Build WHERE clause dynamically
    const conditions: string[] = []
    const params: unknown[] = []

    if (status && status !== 'all') {
      conditions.push('o.status = ?')
      params.push(status)
    }
    if (search) {
      conditions.push(
        '(o.orderNumber LIKE ? OR o.customerName LIKE ? OR o.customerEmail LIKE ? OR o.customerPhone LIKE ?)'
      )
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern, searchPattern)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Fetch paginated orders
    const [orderRows] = await connection.execute(
      `SELECT o.id, o.orderNumber, o.customerName, o.customerEmail, o.customerPhone,
              o.customerAddress, o.customerCity, o.customerCounty, o.customerPostal,
              o.customerCountry, o.message, o.estimatedTotal, o.status, o.paymentMethod,
              o.notes, o.createdAt, o.updatedAt
       FROM \`Order\` o
       ${whereClause}
       ORDER BY o.createdAt DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )

    const orders = orderRows as OrderRow[]

    // Fetch total count for pagination
    const [countRows] = await connection.execute(
      `SELECT COUNT(*) as total FROM \`Order\` o ${whereClause}`,
      params
    )
    const total = (countRows as Array<{ total: number }>)[0]?.total ?? 0

    // Fetch items for all returned orders
    let ordersWithItems: ReturnType<typeof assembleOrdersWithItems> = []
    if (orders.length > 0) {
      const orderIds = orders.map((o) => o.id)
      const placeholders = orderIds.map(() => '?').join(', ')

      const [itemRows] = await connection.execute(
        `SELECT id, orderId, productId, variantId, quantity, price,
                productName, variantName, sku, imageUrl, attributes, createdAt
         FROM OrderItem
         WHERE orderId IN (${placeholders})`,
        orderIds
      )

      ordersWithItems = assembleOrdersWithItems(orders, itemRows as OrderItemRow[])
    }

    // Fetch stats across ALL orders (not just current page)
    const [statsRows] = await connection.execute(
      'SELECT status, estimatedTotal FROM `Order`'
    )

    const allOrders = statsRows as StatsRow[]

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

    await connection.end()

    return NextResponse.json({ orders: ordersWithItems, total, stats })
  } catch (error) {
    console.error('[ADMIN ORDERS] Error fetching orders:', error)
    if (connection) {
      try { await connection.end() } catch {}
    }
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

  let connection: mysql.Connection | null = null

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

    connection = await getConnection()

    // Build SET clause dynamically
    const setClauses: string[] = []
    const updateParams: unknown[] = []

    if (status !== undefined) {
      setClauses.push('status = ?')
      updateParams.push(status)
    }
    if (notes !== undefined) {
      setClauses.push('notes = ?')
      updateParams.push(notes)
    }

    if (setClauses.length === 0) {
      await connection.end()
      return NextResponse.json(
        { message: 'Nimic de actualizat' },
        { status: 400 }
      )
    }

    // Always update the updatedAt timestamp
    setClauses.push('updatedAt = NOW()')

    await connection.execute(
      `UPDATE \`Order\` SET ${setClauses.join(', ')} WHERE id = ?`,
      [...updateParams, orderId]
    )

    // Fetch the updated order
    const [orderRows] = await connection.execute(
      `SELECT id, orderNumber, customerName, customerEmail, customerPhone,
              customerAddress, customerCity, customerCounty, customerPostal,
              customerCountry, message, estimatedTotal, status, paymentMethod,
              notes, createdAt, updatedAt
       FROM \`Order\`
       WHERE id = ?`,
      [orderId]
    )

    const orders = orderRows as OrderRow[]

    if (orders.length === 0) {
      await connection.end()
      return NextResponse.json(
        { message: 'Comanda nu a fost gasita' },
        { status: 404 }
      )
    }

    // Fetch items for this order
    const [itemRows] = await connection.execute(
      `SELECT id, orderId, productId, variantId, quantity, price,
              productName, variantName, sku, imageUrl, attributes, createdAt
       FROM OrderItem
       WHERE orderId = ?`,
      [orderId]
    )

    const items = (itemRows as OrderItemRow[]).map((item) => ({
      ...item,
      attributes: parseAttributes(item.attributes),
    }))

    const updated = { ...orders[0], items }

    await connection.end()

    const logData: Record<string, unknown> = {}
    if (status !== undefined) logData.status = status
    if (notes !== undefined) logData.notes = notes

    console.log(`[ADMIN ORDERS] Updated order ${updated.orderNumber}: ${JSON.stringify(logData)}`)

    return NextResponse.json({ order: updated })
  } catch (error) {
    console.error('[ADMIN ORDERS] Error updating order:', error)
    if (connection) {
      try { await connection.end() } catch {}
    }
    return NextResponse.json(
      { message: 'Eroare la actualizarea comenzii' },
      { status: 500 }
    )
  }
}
