import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import mysql from 'mysql2/promise'

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session
}

async function getDbConnection() {
  return mysql.createConnection(process.env.DATABASE_URL!)
}

const SETTINGS_DEFAULTS = {
  id: 'default',
  companyName: 'Esipca Metalica',
  companyAddress: 'Galati, DN26 Nr 19',
  companyPhone: '+40 (722) 292 519',
  companyEmail: 'clienti@metalfence.ro',
  companyCUI: '',
  companyJ: '',
  smtpHost: '',
  smtpPort: 465,
  smtpUser: '',
  smtpPass: '',
  emailFrom: '',
  emailFromName: '',
  siteTitle: 'Esipca Metalica',
  siteDescription: '',
  metaKeywords: '',
  freeShippingThreshold: 350,
  warrantyYears: 30,
  deliveryDays: '1-7',
  minOrderAmount: 0,
  shippingFee: 0,
  orderConfirmationMessage: '',
}

// GET - Fetch settings
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  let connection
  try {
    connection = await getDbConnection()

    const [rows] = await connection.execute(
      "SELECT * FROM `Settings` WHERE id = 'default' LIMIT 1"
    )
    const settings = (rows as any[])[0]

    await connection.end()

    if (!settings) {
      return NextResponse.json({ settings: SETTINGS_DEFAULTS })
    }

    // Merge with defaults for any missing columns
    const merged = { ...SETTINGS_DEFAULTS, ...settings }
    return NextResponse.json({ settings: merged })
  } catch (error) {
    console.error('[ADMIN SETTINGS] Error fetching settings:', error)
    if (connection) await connection.end().catch(() => {})
    return NextResponse.json(
      { message: 'Eroare la incarcarea setarilor' },
      { status: 500 }
    )
  }
}

// PATCH - Update settings
const patchSchema = z.object({
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().optional(),
  companyCUI: z.string().optional(),
  companyJ: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpUser: z.string().optional(),
  smtpPass: z.string().optional(),
  emailFrom: z.string().optional(),
  emailFromName: z.string().optional(),
  siteTitle: z.string().optional(),
  siteDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  freeShippingThreshold: z.number().optional(),
  warrantyYears: z.number().optional(),
  deliveryDays: z.string().optional(),
  minOrderAmount: z.number().optional(),
  shippingFee: z.number().optional(),
  orderConfirmationMessage: z.string().optional(),
})

export async function PATCH(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  let connection
  try {
    const body = await request.json()
    const validated = patchSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { message: 'Date invalide', errors: validated.error.flatten() },
        { status: 400 }
      )
    }

    const data = validated.data
    connection = await getDbConnection()

    // Build dynamic SET clause
    const setClauses: string[] = []
    const params: unknown[] = []

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        setClauses.push(`\`${key}\` = ?`)
        params.push(value)
      }
    }

    if (setClauses.length === 0) {
      await connection.end()
      return NextResponse.json({ message: 'Nimic de actualizat' }, { status: 400 })
    }

    setClauses.push('updatedAt = NOW()')

    // Upsert: try update first, insert if no rows affected
    const [result] = await connection.execute(
      `UPDATE \`Settings\` SET ${setClauses.join(', ')} WHERE id = 'default'`,
      params
    )

    if ((result as any).affectedRows === 0) {
      // Insert with defaults
      const insertFields = ['id', ...Object.keys(data).filter((k) => data[k as keyof typeof data] !== undefined)]
      const insertValues = ['default', ...Object.values(data).filter((v) => v !== undefined)]
      const placeholders = insertFields.map(() => '?').join(', ')

      await connection.execute(
        `INSERT INTO \`Settings\` (${insertFields.map((f) => `\`${f}\``).join(', ')}) VALUES (${placeholders})`,
        insertValues
      )
    }

    // Fetch updated settings
    const [rows] = await connection.execute(
      "SELECT * FROM `Settings` WHERE id = 'default' LIMIT 1"
    )

    await connection.end()

    const settings = { ...SETTINGS_DEFAULTS, ...(rows as any[])[0] }
    console.log('[ADMIN SETTINGS] Settings updated')

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('[ADMIN SETTINGS] Error updating settings:', error)
    if (connection) await connection.end().catch(() => {})
    return NextResponse.json(
      { message: 'Eroare la actualizarea setarilor' },
      { status: 500 }
    )
  }
}
