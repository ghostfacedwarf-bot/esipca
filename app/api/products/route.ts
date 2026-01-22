import { getAllProducts } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const skip = (page - 1) * limit

    let products = await getAllProducts()

    // Filter by category if specified
    if (categoryId) {
      products = products.filter((p: any) => p.categoryId === categoryId)
    }

    const total = products.length
    const paginatedProducts = products.slice(skip, skip + limit)

    return NextResponse.json(
      {
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
