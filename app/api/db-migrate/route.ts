import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

let migrationInProgress = false
let migrationCompleted = false

/**
 * ONE-TIME database migration endpoint
 * Usage: POST /api/db-migrate?token=YOUR_SECRET_TOKEN
 *
 * Security: Only works with correct token
 * Only runs once per process
 */
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const migrateSecret = process.env.MIGRATE_SECRET

  // Security check - secret MUST be configured via env var
  if (!migrateSecret || token !== migrateSecret) {
    return NextResponse.json(
      { error: 'Unauthorized - invalid token' },
      { status: 401 }
    )
  }

  // Already completed
  if (migrationCompleted) {
    return NextResponse.json(
      { message: 'Migration already completed in this process' },
      { status: 200 }
    )
  }

  // Already in progress
  if (migrationInProgress) {
    return NextResponse.json(
      { error: 'Migration already in progress' },
      { status: 429 }
    )
  }

  migrationInProgress = true

  try {
    console.log('[MIGRATE] Starting database migration...')

    // Run: npx prisma migrate deploy
    await runCommand('npx', ['prisma', 'migrate', 'deploy'], {
      cwd: process.cwd(),
    })

    console.log('[MIGRATE] ✅ Migration completed successfully')

    // Run: npx prisma db seed
    console.log('[MIGRATE] Starting database seed...')
    await runCommand('npx', ['prisma', 'db', 'seed'], {
      cwd: process.cwd(),
    })

    console.log('[MIGRATE] ✅ Seed completed successfully')
    migrationCompleted = true

    return NextResponse.json(
      {
        success: true,
        message: 'Database migration and seeding completed',
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMsg = (error as Error).message
    console.error('[MIGRATE] ❌ Error:', errorMsg)

    return NextResponse.json(
      {
        success: false,
        error: 'Migration failed',
      },
      { status: 500 }
    )
  } finally {
    migrationInProgress = false
  }
}

function runCommand(
  command: string,
  args: string[],
  options: { cwd: string }
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: 'inherit',
      shell: true,
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command exited with code ${code}`))
      }
    })

    child.on('error', (error) => {
      reject(error)
    })
  })
}
