import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/password'
import jwt from 'jsonwebtoken'
import { Role } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

const updateUserSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter').optional(),
  email: z.string().email('Email tidak valid').optional(),
  password: z.string().min(6, 'Password minimal 6 karakter').optional(),
  nama_lengkap: z.string().min(1, 'Nama lengkap harus diisi').optional(),
  nip: z.string().optional(),
  jabatan: z.string().optional(),
  instansi: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  is_active: z.boolean().optional()
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin access
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya admin yang bisa mengakses.' },
        { status: 403 }
      )
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID user tidak valid' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { id_user: id },
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
        updatedAt: true,
        _count: {
          peminjaman_created: true,
          peminjaman_approved: true,
          pengembalian_created: true
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Get user detail error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil detail user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin access
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya admin yang bisa mengakses.' },
        { status: 403 }
      )
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID user tidak valid' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id_user: id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Check if username or email already exists (excluding current user)
    if (validatedData.username || validatedData.email) {
      const duplicateUser = await db.user.findFirst({
        where: {
          AND: [
            { id_user: { not: id } },
            {
              OR: [
                validatedData.username ? { username: validatedData.username } : {},
                validatedData.email ? { email: validatedData.email } : {}
              ].filter(condition => Object.keys(condition).length > 0)
            }
          ]
        }
      })

      if (duplicateUser) {
        return NextResponse.json(
          { error: 'Username atau email sudah digunakan' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = { ...validatedData }
    
    // Hash password if provided
    if (validatedData.password) {
      updateData.password_hash = await hashPassword(validatedData.password)
      delete updateData.password
    }

    // Update user
    const user = await db.user.update({
      where: { id_user: id },
      data: updateData,
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
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'User berhasil diupdate',
      user
    })

  } catch (error) {
    console.error('Update user error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Data tidak valid', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate user' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin access
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya admin yang bisa mengakses.' },
        { status: 403 }
      )
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID user tidak valid' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id_user: id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Prevent deletion of admin users if there's only one admin
    if (existingUser.role === 'ADMIN') {
      const adminCount = await db.user.count({
        where: { role: 'ADMIN', is_active: true }
      })

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Tidak bisa menghapus admin terakhir' },
          { status: 400 }
        )
      }
    }

    // Soft delete by setting is_active to false
    await db.user.update({
      where: { id_user: id },
      data: { is_active: false }
    })

    return NextResponse.json({
      message: 'User berhasil dinonaktifkan'
    })

  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menonaktifkan user' },
      { status: 500 }
    )
  }
}