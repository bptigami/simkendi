import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 })
    }

    // Step 1: Decode token
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token', details: error.message }, { status: 401 })
    }

    // Step 2: Find user in database
    const user = await db.user.findUnique({
      where: { id_user: decoded.userId },
      select: { 
        id_user: true, 
        username: true, 
        role: true, 
        is_active: true,
        email: true,
        nama_lengkap: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Step 3: Check admin status
    const isAdmin = user.role === 'ADMIN' && user.is_active

    return NextResponse.json({
      decoded,
      user,
      isAdmin,
      message: isAdmin ? 'User is admin' : 'User is not admin'
    })

  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}