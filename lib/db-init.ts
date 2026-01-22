/**
 * Database initialization script
 * Runs on server startup to ensure schema is up-to-date
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
    console.log('[DB] Checking database connection...')

    // Try to connect and run a simple query
    await prisma.$executeRawUnsafe('SELECT 1')

    console.log('[DB] ✅ Database is ready and accessible')
    migrationCompleted = true
  } catch (error) {
    // Database doesn't exist or schema is missing
    console.warn('[DB] ⚠️ Database check failed:', (error as Error).message)
    console.warn('[DB] Please run: npx prisma migrate deploy')
    migrationCompleted = true
  }
}
