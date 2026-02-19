import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise'

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session
}

async function getDbConnection() {
  return mysql.createConnection(process.env.DATABASE_URL!)
}

/** Get current user ID from admin_user cookie */
async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('admin_user')
  if (!userCookie?.value) return null
  try {
    const parsed = JSON.parse(userCookie.value)
    return parsed.id || null
  } catch {
    return null
  }
}

// GET - List all users with stats
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  let connection
  try {
    connection = await getDbConnection()

    const [rows] = await connection.execute(
      'SELECT id, email, name, role, createdAt, updatedAt FROM `User` ORDER BY createdAt DESC'
    )
    const users = rows as Array<{
      id: string
      email: string
      name: string | null
      role: string
      createdAt: Date
      updatedAt: Date
    }>

    const total = users.length
    const admins = users.filter((u) => u.role === 'admin').length
    const editors = users.filter((u) => u.role === 'editor').length
    const latest = users.length > 0 ? users[0].createdAt : null

    await connection.end()

    return NextResponse.json({
      users,
      stats: { total, admins, editors, latest },
    })
  } catch (error) {
    console.error('[ADMIN USERS] Error fetching users:', error)
    if (connection) await connection.end().catch(() => {})
    return NextResponse.json(
      { message: 'Eroare la incarcarea utilizatorilor' },
      { status: 500 }
    )
  }
}

// POST - Create a new user
const createSchema = z.object({
  email: z.string().email('Email invalid'),
  password: z.string().min(8, 'Parola trebuie sa aiba minim 8 caractere'),
  name: z.string().min(1, 'Numele este obligatoriu'),
  role: z.enum(['admin', 'editor']),
})

export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  let connection
  try {
    const body = await request.json()
    const validated = createSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { message: 'Date invalide', errors: validated.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password, name, role } = validated.data
    connection = await getDbConnection()

    // Check email uniqueness
    const [existing] = await connection.execute(
      'SELECT id FROM `User` WHERE email = ? LIMIT 1',
      [email]
    )
    if ((existing as any[]).length > 0) {
      await connection.end()
      return NextResponse.json(
        { message: 'Aceasta adresa de email este deja folosita' },
        { status: 409 }
      )
    }

    const id = uuid()
    const hashedPassword = await bcrypt.hash(password, 12)
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    await connection.execute(
      'INSERT INTO `User` (id, email, password, name, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, email, hashedPassword, name, role, now, now]
    )

    const [rows] = await connection.execute(
      'SELECT id, email, name, role, createdAt, updatedAt FROM `User` WHERE id = ?',
      [id]
    )

    await connection.end()

    const user = (rows as any[])[0]
    console.log(`[ADMIN USERS] User created: ${email} (${role})`)

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('[ADMIN USERS] Error creating user:', error)
    if (connection) await connection.end().catch(() => {})
    return NextResponse.json(
      { message: 'Eroare la crearea utilizatorului' },
      { status: 500 }
    )
  }
}

// PATCH - Update a user
const patchSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'editor']).optional(),
  password: z.string().min(8).optional(),
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

    const { userId, name, email, role, password } = validated.data
    connection = await getDbConnection()

    // Check email uniqueness if changed
    if (email) {
      const [existing] = await connection.execute(
        'SELECT id FROM `User` WHERE email = ? AND id != ? LIMIT 1',
        [email, userId]
      )
      if ((existing as any[]).length > 0) {
        await connection.end()
        return NextResponse.json(
          { message: 'Aceasta adresa de email este deja folosita' },
          { status: 409 }
        )
      }
    }

    const setClauses: string[] = []
    const params: unknown[] = []

    if (name !== undefined) {
      setClauses.push('name = ?')
      params.push(name)
    }
    if (email !== undefined) {
      setClauses.push('email = ?')
      params.push(email)
    }
    if (role !== undefined) {
      setClauses.push('role = ?')
      params.push(role)
    }
    if (password !== undefined) {
      setClauses.push('password = ?')
      params.push(await bcrypt.hash(password, 12))
    }

    if (setClauses.length === 0) {
      await connection.end()
      return NextResponse.json({ message: 'Nimic de actualizat' }, { status: 400 })
    }

    setClauses.push('updatedAt = NOW()')
    await connection.execute(
      `UPDATE \`User\` SET ${setClauses.join(', ')} WHERE id = ?`,
      [...params, userId]
    )

    const [rows] = await connection.execute(
      'SELECT id, email, name, role, createdAt, updatedAt FROM `User` WHERE id = ?',
      [userId]
    )

    await connection.end()

    const user = (rows as any[])[0]
    if (!user) {
      return NextResponse.json({ message: 'Utilizatorul nu a fost gasit' }, { status: 404 })
    }

    console.log(`[ADMIN USERS] User updated: ${user.email}`)
    return NextResponse.json({ user })
  } catch (error) {
    console.error('[ADMIN USERS] Error updating user:', error)
    if (connection) await connection.end().catch(() => {})
    return NextResponse.json(
      { message: 'Eroare la actualizarea utilizatorului' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a user
const deleteSchema = z.object({
  userId: z.string().min(1),
})

export async function DELETE(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: 'Neautorizat' }, { status: 401 })
  }

  let connection
  try {
    const body = await request.json()
    const validated = deleteSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { message: 'Date invalide', errors: validated.error.flatten() },
        { status: 400 }
      )
    }

    const { userId } = validated.data
    connection = await getDbConnection()

    // Prevent self-deletion
    const currentUserId = await getCurrentUserId()
    if (currentUserId === userId) {
      await connection.end()
      return NextResponse.json(
        { message: 'Nu va puteti sterge propriul cont' },
        { status: 400 }
      )
    }

    // Prevent deleting last admin
    const [adminCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM `User` WHERE role = 'admin'"
    )
    const count = (adminCount as any[])[0]?.count || 0

    const [userRows] = await connection.execute(
      'SELECT role FROM `User` WHERE id = ?',
      [userId]
    )
    const targetUser = (userRows as any[])[0]

    if (targetUser?.role === 'admin' && count <= 1) {
      await connection.end()
      return NextResponse.json(
        { message: 'Nu puteti sterge ultimul administrator' },
        { status: 400 }
      )
    }

    await connection.execute('DELETE FROM `User` WHERE id = ?', [userId])
    await connection.end()

    console.log(`[ADMIN USERS] User deleted: ${userId}`)
    return NextResponse.json({ message: 'Utilizatorul a fost sters' })
  } catch (error) {
    console.error('[ADMIN USERS] Error deleting user:', error)
    if (connection) await connection.end().catch(() => {})
    return NextResponse.json(
      { message: 'Eroare la stergerea utilizatorului' },
      { status: 500 }
    )
  }
}
