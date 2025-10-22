import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/password'
import jwt from 'jsonwebtoken'
import { Role } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

const createUserSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  nama_lengkap: z.string().min(1, 'Nama lengkap harus diisi'),
  nip: z.string().optional(),
  jabatan: z.string().optional(),
  instansi: z.string().optional(),
  role: z.nativeEnum(Role).default('USER')
})

const updateUserSchema = createUserSchema.partial().omit({ password: true }).extend({
  password: z.string().min(6, 'Password minimal 6 karakter').optional()
})

// Middleware to check if user is admin
async function isAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const user = await db.user.findUnique({
      where: { id_user: decoded.userId },
      select: { role: true, is_active: true }
    })
    
    return user && user.role === 'ADMIN' && user.is_active
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya admin yang bisa mengakses.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') as Role | null

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { username: { contains: search } },
        { nama_lengkap: { contains: search } },
        { email: { contains: search } },
        { nip: { contains: search } }
      ]
    }

    if (role) {
      where.role = role
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
          createdAt: true,
          updatedAt: true
        }
      }),
      db.user.count({ where })
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya admin yang bisa mengakses.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    // Check if username or email already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { username: validatedData.username },
          { email: validatedData.email }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username atau email sudah digunakan' },
        { status: 400 }
      )
    }

    // Hash password
    const password_hash = await hashPassword(validatedData.password)

    // Create user
    const { password, ...userDataWithoutPassword } = validatedData
    const user = await db.user.create({
      data: {
        ...userDataWithoutPassword,
        password_hash: password_hash
      },
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
        createdAt: true
      }
    })

    return NextResponse.json({
      message: 'User berhasil dibuat',
      user
    }, { status: 201 })

  } catch (error) {
    console.error('Create user error:', error)
    
    if (error instanceof z.ZodError) {
      console.error('Zod validation errors:', error.errors)
      return NextResponse.json(
        { error: 'Data tidak valid', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Database or other error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat user', details: error.message },
      { status: 500 }
    )
  }
}