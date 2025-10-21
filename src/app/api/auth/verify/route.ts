import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Get fresh user data from database
    const user = await db.user.findUnique({
      where: { id_user: decoded.userId },
      select: {
        id_user: true,
        username: true,
        email: true,
        nama_lengkap: true,
        nip: true,
        jabatan: true,
        instansi: true,
        role: true,
        is_active: true,
        last_login: true,
        createdAt: true
      }
    })

    if (!user || !user.is_active) {
      return NextResponse.json(
        { error: 'User tidak ditemukan atau tidak aktif' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      valid: true,
      user
    })

  } catch (error) {
    console.error('Token verification error:', error)
    
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat verifikasi token' },
      { status: 500 }
    )
  }
}