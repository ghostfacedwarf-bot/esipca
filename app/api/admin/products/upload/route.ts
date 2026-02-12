import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import mysql from 'mysql2/promise'
import { v4 as uuid } from 'uuid'

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return !!session
}

async function getDbConnection() {
  return mysql.createConnection(process.env.DATABASE_URL!)
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// POST - Upload image(s) for a product
export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const productId = formData.get('productId') as string
    const files = formData.getAll('files') as File[]

    if (!productId || files.length === 0) {
      return NextResponse.json(
        { error: 'ProductId și cel puțin un fișier sunt necesare' },
        { status: 400 }
      )
    }

    const connection = await getDbConnection()

    // Validate product exists
    const [rows] = await connection.execute(
      'SELECT id, name FROM `Product` WHERE id = ? LIMIT 1',
      [productId]
    )
    const products = rows as Array<{ id: string; name: string }>
    if (products.length === 0) {
      await connection.end()
      return NextResponse.json({ error: 'Produsul nu există' }, { status: 404 })
    }

    const productName = products[0].name

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products', productId)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Get current max sortOrder
    const [mediaRows] = await connection.execute(
      'SELECT MAX(sortOrder) as maxSort FROM `Media` WHERE productId = ?',
      [productId]
    )
    let nextSortOrder = ((mediaRows as any[])[0]?.maxSort ?? -1) + 1

    const uploadedMedia: Array<{ id: string; url: string; alt: string; sortOrder: number }> = []

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        continue
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        continue
      }

      // Generate safe filename
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const filePath = path.join(uploadDir, safeName)
      const publicUrl = `/uploads/products/${productId}/${safeName}`

      // Write file to disk
      const bytes = await file.arrayBuffer()
      await writeFile(filePath, Buffer.from(bytes))

      // Create media record in DB
      const mediaId = uuid()
      await connection.execute(
        'INSERT INTO `Media` (id, productId, url, alt, sortOrder) VALUES (?, ?, ?, ?, ?)',
        [mediaId, productId, publicUrl, productName, nextSortOrder]
      )

      uploadedMedia.push({
        id: mediaId,
        url: publicUrl,
        alt: productName,
        sortOrder: nextSortOrder,
      })
      nextSortOrder++
    }

    await connection.end()

    return NextResponse.json({
      success: true,
      uploaded: uploadedMedia.length,
      media: uploadedMedia,
    })
  } catch (error) {
    console.error('[Admin Upload] Error:', error)
    return NextResponse.json({ error: 'Eroare la upload' }, { status: 500 })
  }
}

// DELETE - Remove a media item
export async function DELETE(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
  }

  try {
    const { mediaId } = await request.json()

    if (!mediaId) {
      return NextResponse.json({ error: 'mediaId este necesar' }, { status: 400 })
    }

    const connection = await getDbConnection()

    // Find media record
    const [rows] = await connection.execute(
      'SELECT id, url FROM `Media` WHERE id = ? LIMIT 1',
      [mediaId]
    )
    const mediaRecords = rows as Array<{ id: string; url: string }>

    if (mediaRecords.length === 0) {
      await connection.end()
      return NextResponse.json({ error: 'Media nu există' }, { status: 404 })
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), 'public', mediaRecords[0].url)
    try {
      await unlink(filePath)
    } catch {
      // File might not exist on disk, continue with DB deletion
    }

    // Delete from DB
    await connection.execute('DELETE FROM `Media` WHERE id = ?', [mediaId])
    await connection.end()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Admin Delete Media] Error:', error)
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 })
  }
}
