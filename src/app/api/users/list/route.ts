import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware to verify token
async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify token
    const tokenData = await verifyToken(request)
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current user
    const currentUser = await db.user.findUnique({
      where: { id_user: tokenData.userId },
      select: { role: true, is_active: true }
    })

    if (!currentUser || !currentUser.is_active) {
      return NextResponse.json(
        { error: 'User tidak valid' },
        { status: 401 }
      )
    }

    // Build where clause - only show active users
    const where: any = {
      is_active: true
    }

    // If user is not admin/pimpinan, only show themselves
    if (currentUser.role === 'USER') {
      where.id_user = tokenData.userId
    }

    const users = await db.user.findMany({
      where,
      orderBy: { nama_lengkap: 'asc' },
      select: {
        id_user: true,
        username: true,
        email: true,
        nama_lengkap: true,
        nip: true,
        jabatan: true,
        instansi: true,
        role: true,
        is_active: true
      }
    })

    return NextResponse.json({
      users,
      total: users.length
    })

  } catch (error) {
    console.error('Get users list error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data users' },
      { status: 500 }
    )
  }
}