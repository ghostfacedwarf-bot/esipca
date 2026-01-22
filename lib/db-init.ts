/**
 * Database initialization script
 * Checks database connectivity on server startup
 *
 * Note: Migrations must be run separately since this is shared hosting
 * without CLI access. Run: npx prisma migrate deploy
 */

import { PrismaClient } from '@prisma/client'

let migrationCompleted = false
const prisma = new PrismaClient()

export async function ensureDatabaseReady() {
  // Skip if already completed in this process
  if (migrationCompleted) {
    return
  }

  try {
    console.log('[DB] 🔄 Database health check...')

    // Try to connect and run a simple query
    await prisma.$executeRawUnsafe('SELECT 1')
    console.log('[DB] ✅ Database connection successful')

    migrationCompleted = true
  } catch (error) {
    const errorMsg = (error as Error).message
    console.error('[DB] ⚠️ Database error:', errorMsg)

    // Provide helpful error messages
    if (errorMsg.includes('Unknown database')) {
      console.error('[DB] ❌ Database does not exist or tables not created')
      console.error('[DB] Run: npx prisma migrate deploy')
    } else if (errorMsg.includes('Access denied')) {
      console.error('[DB] ❌ Database credentials incorrect')
      console.error('[DB] Check DATABASE_URL in .env')
    } else if (errorMsg.includes('ECONNREFUSED')) {
      console.error('[DB] ❌ Cannot connect to database server')
      console.error('[DB] Check host and port in DATABASE_URL')
    }

    // Mark as completed to avoid repeated errors
    migrationCompleted = true
  }
}
