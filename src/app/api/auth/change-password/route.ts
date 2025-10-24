import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword, userId } = await request.json()

    // Validate input
    if (!currentPassword || !newPassword || !userId) {
      return NextResponse.json(
        { error: 'Password lama, password baru, dan user ID harus diisi' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password baru minimal 6 karakter' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { id_user: parseInt(userId) }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Password lama tidak sesuai' },
        { status: 400 }
      )
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password_hash)
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'Password baru tidak boleh sama dengan password lama' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // Update password in database
    await db.user.update({
      where: { id_user: user.id_user },
      data: { password_hash: hashedNewPassword }
    })

    return NextResponse.json({
      message: 'Password berhasil diubah'
    })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}