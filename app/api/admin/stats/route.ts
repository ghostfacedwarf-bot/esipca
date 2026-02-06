import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Use DB aggregation instead of fetching all records
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      completedOrders,
      cancelledOrders,
      revenueAgg,
      revenueMonthAgg,
      ordersLast7,
      ordersLast30,
      uniqueCustomersResult,
      recentOrders,
      recentOrderItems,
      productCount,
      activeProducts,
      newsletterActive,
      newsletterTotal,
      newsletterLast30,
      chatCount,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.count({ where: { status: 'confirmed' } }),
      prisma.order.count({ where: { status: 'shipped' } }),
      prisma.order.count({ where: { status: 'completed' } }),
      prisma.order.count({ where: { status: 'cancelled' } }),
      prisma.order.aggregate({
        _sum: { estimatedTotal: true },
        where: { status: { not: 'cancelled' } },
      }),
      prisma.order.aggregate({
        _sum: { estimatedTotal: true },
        where: {
          status: { not: 'cancelled' },
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.order.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.order.findMany({
        where: { status: { not: 'cancelled' } },
        select: { customerEmail: true },
        distinct: ['customerEmail'],
      }),
      // Recent orders for chart data (last 30 days only)
      prisma.order.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { status: true, estimatedTotal: true, createdAt: true },
      }),
      prisma.orderItem.findMany({
        where: { order: { createdAt: { gte: thirtyDaysAgo } } },
        select: { productName: true, quantity: true, price: true },
      }),
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({
        where: { subscribedAt: { gte: thirtyDaysAgo } },
      }),
      prisma.chat.count(),
    ])

    const totalRevenue = revenueAgg._sum.estimatedTotal || 0
    const revenueThisMonth = revenueMonthAgg._sum.estimatedTotal || 0

    // Build 30-day chart data from recent orders only
    const dailyOrders: Record<string, number> = {}
    const dailyRevenue: Record<string, number> = {}
    for (const order of recentOrders) {
      const dayKey = new Date(order.createdAt).toISOString().slice(0, 10)
      dailyOrders[dayKey] = (dailyOrders[dayKey] || 0) + 1
      if (order.status !== 'cancelled' && order.estimatedTotal) {
        dailyRevenue[dayKey] = (dailyRevenue[dayKey] || 0) + order.estimatedTotal
      }
    }

    const chartData: Array<{ date: string; orders: number; revenue: number }> = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const key = d.toISOString().slice(0, 10)
      chartData.push({
        date: key,
        orders: dailyOrders[key] || 0,
        revenue: dailyRevenue[key] || 0,
      })
    }

    // Top products (last 30 days)
    const productAgg: Record<string, { name: string; quantity: number; revenue: number }> = {}
    for (const item of recentOrderItems) {
      const key = item.productName
      if (!productAgg[key]) {
        productAgg[key] = { name: key, quantity: 0, revenue: 0 }
      }
      productAgg[key].quantity += item.quantity
      productAgg[key].revenue += item.price * item.quantity
    }
    const topProducts = Object.values(productAgg)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Top customers - use limited query
    const topCustomerOrders = await prisma.order.groupBy({
      by: ['customerEmail', 'customerName'],
      where: { status: { not: 'cancelled' } },
      _count: { id: true },
      _sum: { estimatedTotal: true },
      orderBy: { _sum: { estimatedTotal: 'desc' } },
      take: 10,
    })
    const topCustomers = topCustomerOrders.map((c) => ({
      email: c.customerEmail,
      name: c.customerName,
      orders: c._count.id,
      total: c._sum.estimatedTotal || 0,
    }))

    return NextResponse.json({
      overview: {
        totalOrders,
        ordersLast7Days: ordersLast7,
        ordersLast30Days: ordersLast30,
        totalRevenue,
        revenueThisMonth,
        uniqueCustomers: uniqueCustomersResult.length,
        totalProducts: productCount,
        activeProducts,
        chats: chatCount,
      },
      ordersByStatus: {
        pending: pendingOrders,
        confirmed: confirmedOrders,
        shipped: shippedOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
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
    return NextResponse.json(
      { message: 'Eroare la incarcarea statisticilor' },
      { status: 500 }
    )
  }
}
