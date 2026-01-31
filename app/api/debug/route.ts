import { NextRequest, NextResponse } from 'next/server'

/**
 * Debug endpoint - ONLY available in development mode
 * Disabled in production for security
 */
export async function GET(request: NextRequest) {
  // Security: Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    )
  }

  // Require debug token even in development
  const token = request.nextUrl.searchParams.get('token')
  const debugToken = process.env.DEBUG_TOKEN

  if (!debugToken || token !== debugToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Only return non-sensitive info
  const debug = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    databaseConfigured: !!process.env.DATABASE_URL,
  }

  return NextResponse.json(debug)
}
