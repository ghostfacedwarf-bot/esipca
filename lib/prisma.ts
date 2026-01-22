import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Load environment variables from .env files if not already loaded
function loadEnvVariables() {
  // Check if DATABASE_URL is already set
  if (process.env.DATABASE_URL) {
    return
  }

  // Try to load from .env.production first (for Hostinger), then .env
  const envFiles = [
    path.join(process.cwd(), '.env.production'),
    path.join(process.cwd(), '.env'),
  ]

  for (const envFile of envFiles) {
    try {
      if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, 'utf-8')
        const lines = content.split('\n')

        for (const line of lines) {
          if (!line.startsWith('#') && line.includes('=')) {
            const [key, value] = line.split('=')
            const trimmedKey = key.trim()
            const trimmedValue = value.trim().replace(/^"|"$/g, '')

            if (!process.env[trimmedKey]) {
              process.env[trimmedKey] = trimmedValue
            }
          }
        }

        if (process.env.DATABASE_URL) {
          console.log(`[Prisma] Loaded environment from ${envFile}`)
          break
        }
      }
    } catch (error) {
      // Silently skip if file can't be read
    }
  }
}

// Load environment variables before creating Prisma client
loadEnvVariables()

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
