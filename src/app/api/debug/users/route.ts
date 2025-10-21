import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id_user: true,
        username: true,
        email: true,
        nama_lengkap: true,
        role: true,
        is_active: true,
        createdAt: true
      },
      orderBy: { id_user: 'asc' }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Debug users error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}