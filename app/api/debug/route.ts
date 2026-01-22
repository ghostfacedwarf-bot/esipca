import { NextResponse } from 'next/server'
import { getAllProducts, getCategories } from '@/lib/db'

export async function GET() {
  const debug: any = {
    timestamp: new Date().toISOString(),
    databaseUrl: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT SET',
    detectedType: 'unknown',
  }

  // Detect database type
  const url = process.env.DATABASE_URL || ''
  if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
    debug.detectedType = 'postgresql'
  } else if (url.startsWith('mysql://')) {
    debug.detectedType = 'mysql'
  } else {
    debug.detectedType = 'unknown (defaulting to mysql)'
  }

  try {
    debug.categories = { status: 'fetching...' }
    const categories = await getCategories()
    debug.categories = { status: 'ok', count: categories.length }
  } catch (error: any) {
    debug.categories = { status: 'error', message: error.message }
  }

  try {
    debug.products = { status: 'fetching...' }
    const products = await getAllProducts()
    debug.products = { status: 'ok', count: products.length }
  } catch (error: any) {
    debug.products = { status: 'error', message: error.message }
  }

  return NextResponse.json(debug)
}
