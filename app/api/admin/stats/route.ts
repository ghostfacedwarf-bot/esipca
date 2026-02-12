import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import mysql from 'mysql2/promise'

async function getConnection() {
  return mysql.createConnection(process.env.DATABASE_URL || '')
}

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  let connection: mysql.Connection | null = null

  try {
    connection = await getConnection()

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().slice(0, 19).replace('T', ' ')
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 19).replace('T', ' ')

    // --- Overview counts ---
    const [
      [totalOrdersRow],
      [ordersLast7Row],
      [ordersLast30Row],
      [totalRevenueRow],
      [revenueThisMonthRow],
      [uniqueCustomersRow],
      [totalProductsRow],
      [activeProductsRow],
      [chatCountRow],
    ] = await Promise.all([
      connection.execute('SELECT COUNT(*) AS cnt FROM `Order`'),
      connection.execute('SELECT COUNT(*) AS cnt FROM `Order` WHERE createdAt >= ?', [sevenDaysAgoStr]),
      connection.execute('SELECT COUNT(*) AS cnt FROM `Order` WHERE createdAt >= ?', [thirtyDaysAgoStr]),
      connection.execute(
        'SELECT COALESCE(SUM(estimatedTotal), 0) AS total FROM `Order` WHERE status != ?',
        ['cancelled']
      ),
      connection.execute(
        'SELECT COALESCE(SUM(estimatedTotal), 0) AS total FROM `Order` WHERE status != ? AND createdAt >= ?',
        ['cancelled', thirtyDaysAgoStr]
      ),
      connection.execute(
        'SELECT COUNT(DISTINCT customerEmail) AS cnt FROM `Order` WHERE status != ?',
        ['cancelled']
      ),
      connection.execute('SELECT COUNT(*) AS cnt FROM Product'),
      connection.execute('SELECT COUNT(*) AS cnt FROM Product WHERE isActive = true'),
      connection.execute('SELECT COUNT(*) AS cnt FROM Chat'),
    ]) as any[][]

    const totalOrders = (totalOrdersRow as any[])[0].cnt
    const ordersLast7 = (ordersLast7Row as any[])[0].cnt
    const ordersLast30 = (ordersLast30Row as any[])[0].cnt
    const totalRevenue = Number((totalRevenueRow as any[])[0].total) || 0
    const revenueThisMonth = Number((revenueThisMonthRow as any[])[0].total) || 0
    const uniqueCustomers = (uniqueCustomersRow as any[])[0].cnt
    const totalProductsCount = (totalProductsRow as any[])[0].cnt
    const activeProductsCount = (activeProductsRow as any[])[0].cnt
    const chatCount = (chatCountRow as any[])[0].cnt

    // --- Orders by status ---
    const [statusRows] = await connection.execute(
      'SELECT status, COUNT(*) AS cnt FROM `Order` GROUP BY status'
    )

    const statusMap: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
    }
    for (const row of statusRows as any[]) {
      if (row.status in statusMap) {
        statusMap[row.status] = Number(row.cnt)
      }
    }

    // --- Chart data: daily orders + revenue for last 30 days ---
    const [dailyOrderRows] = await connection.execute(
      `SELECT DATE(createdAt) AS day, COUNT(*) AS orders,
              COALESCE(SUM(CASE WHEN status != 'cancelled' THEN estimatedTotal ELSE 0 END), 0) AS revenue
       FROM \`Order\`
       WHERE createdAt >= ?
       GROUP BY DATE(createdAt)`,
      [thirtyDaysAgoStr]
    )

    const dailyMap: Record<string, { orders: number; revenue: number }> = {}
    for (const row of dailyOrderRows as any[]) {
      const dayKey = new Date(row.day).toISOString().slice(0, 10)
      dailyMap[dayKey] = {
        orders: Number(row.orders),
        revenue: Number(row.revenue) || 0,
      }
    }

    const chartData: Array<{ date: string; orders: number; revenue: number }> = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const key = d.toISOString().slice(0, 10)
      chartData.push({
        date: key,
        orders: dailyMap[key]?.orders || 0,
        revenue: dailyMap[key]?.revenue || 0,
      })
    }

    // --- Top products (last 30 days) ---
    const [topProductRows] = await connection.execute(
      `SELECT oi.productName AS name,
              SUM(oi.quantity) AS quantity,
              SUM(oi.price * oi.quantity) AS revenue
       FROM OrderItem oi
       INNER JOIN \`Order\` o ON oi.orderId = o.id
       WHERE o.createdAt >= ?
       GROUP BY oi.productName
       ORDER BY revenue DESC
       LIMIT 10`,
      [thirtyDaysAgoStr]
    )

    const topProducts = (topProductRows as any[]).map((row) => ({
      name: row.name,
      quantity: Number(row.quantity),
      revenue: Number(row.revenue) || 0,
    }))

    // --- Top customers (excluding cancelled, top 10 by total spent) ---
    const [topCustomerRows] = await connection.execute(
      `SELECT customerEmail AS email, customerName AS name,
              COUNT(*) AS orders,
              COALESCE(SUM(estimatedTotal), 0) AS total
       FROM \`Order\`
       WHERE status != ?
       GROUP BY customerEmail, customerName
       ORDER BY total DESC
       LIMIT 10`,
      ['cancelled']
    )

    const topCustomers = (topCustomerRows as any[]).map((row) => ({
      email: row.email,
      name: row.name,
      orders: Number(row.orders),
      total: Number(row.total) || 0,
    }))

    // --- Newsletter stats ---
    const [
      [newsletterTotalRow],
      [newsletterActiveRow],
      [newsletterLast30Row],
    ] = await Promise.all([
      connection.execute('SELECT COUNT(*) AS cnt FROM NewsletterSubscriber'),
      connection.execute('SELECT COUNT(*) AS cnt FROM NewsletterSubscriber WHERE isActive = true'),
      connection.execute('SELECT COUNT(*) AS cnt FROM NewsletterSubscriber WHERE subscribedAt >= ?', [thirtyDaysAgoStr]),
    ]) as any[][]

    const newsletterTotal = (newsletterTotalRow as any[])[0].cnt
    const newsletterActive = (newsletterActiveRow as any[])[0].cnt
    const newsletterLast30 = (newsletterLast30Row as any[])[0].cnt

    await connection.end()

    return NextResponse.json({
      overview: {
        totalOrders,
        ordersLast7Days: ordersLast7,
        ordersLast30Days: ordersLast30,
        totalRevenue,
        revenueThisMonth,
        uniqueCustomers,
        totalProducts: totalProductsCount,
        activeProducts: activeProductsCount,
        chats: chatCount,
      },
      ordersByStatus: {
        pending: statusMap.pending,
        confirmed: statusMap.confirmed,
        shipped: statusMap.shipped,
        completed: statusMap.completed,
        cancelled: statusMap.cancelled,
      },
      chartData,
      topProducts,
      topCustomers,
      newsletter: {
        total: newsletterTotal,
        active: newsletterActive,
        newLast30Days: newsletterLast30,
      },
    })
  } catch (error) {
    console.error('[ADMIN STATS] Error fetching stats:', error)
    if (connection) {
      try { await connection.end() } catch {}
    }
    return NextResponse.json(
      { message: 'Eroare la incarcarea statisticilor' },
      { status: 500 }
    )
  }
}
