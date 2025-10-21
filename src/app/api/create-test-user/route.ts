import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/password'

export async function GET() {
  try {
    // Get all users
    const users = await db.user.findMany({
      select: {
        username: true,
        nama_lengkap: true,
        role: true
      }
    })

    // Create test users if no users exist
    if (users.length === 0) {
      // Create admin user
      const adminPassword = await hashPassword('admin123')
      const admin = await db.user.create({
        data: {
          username: 'admin',
          email: 'admin@example.com',
          password_hash: adminPassword,
          nama_lengkap: 'Administrator',
          role: 'ADMIN',
          is_active: true
        }
      })

      // Create test user
      const userPassword = await hashPassword('password123')
      const testUser = await db.user.create({
        data: {
          username: 'testuser',
          email: 'test@example.com',
          password_hash: userPassword,
          nama_lengkap: 'Test User',
          role: 'USER',
          is_active: true
        }
      })

      return NextResponse.json({
        message: 'Created default users with hashed passwords',
        users: [
          {
            username: 'admin',
            password: 'admin123',
            role: 'ADMIN',
            nama: 'Administrator'
          },
          {
            username: 'testuser',
            password: 'password123',
            role: 'USER',
            nama: 'Test User'
          }
        ]
      })
    }

    // If users exist, show existing users (without passwords)
    return NextResponse.json({
      message: 'Users already exist',
      users: users.map(user => ({
        username: user.username,
        role: user.role,
        nama: user.nama_lengkap
      }))
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to create users' }, { status: 500 })
  }
}