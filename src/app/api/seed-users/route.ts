import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/password'

export async function POST() {
  try {
    // Check if users already exist
    const existingUsers = await db.user.count()
    if (existingUsers > 0) {
      return NextResponse.json({ message: 'Users already exist' })
    }

    // Default users
    const defaultUsers = [
      {
        username: 'admin',
        email: 'admin@sistem.com',
        password_hash: await hashPassword('admin123'),
        nama_lengkap: 'Administrator',
        nip: 'ADMIN001',
        jabatan: 'Administrator Sistem',
        instansi: 'IT Department',
        role: 'ADMIN',
        is_active: true
      },
      {
        username: 'pimpinan',
        email: 'pimpinan@sistem.com',
        password_hash: await hashPassword('pimpinan123'),
        nama_lengkap: 'Pimpinan',
        nip: 'PIMPINAN001',
        jabatan: 'Pimpinan',
        instansi: 'Executive Office',
        role: 'PIMPINAN',
        is_active: true
      },
      {
        username: 'petugas',
        email: 'petugas@sistem.com',
        password_hash: await hashPassword('petugas123'),
        nama_lengkap: 'Petugas',
        nip: 'PETUGAS001',
        jabatan: 'Petugas',
        instansi: 'Operations',
        role: 'PETUGAS',
        is_active: true
      },
      {
        username: 'user',
        email: 'user@sistem.com',
        password_hash: await hashPassword('user123'),
        nama_lengkap: 'User Biasa',
        nip: 'USER001',
        jabatan: 'Staff',
        instansi: 'General',
        role: 'USER',
        is_active: true
      },
      {
        username: 'testuser',
        email: 'test@example.com',
        password_hash: await hashPassword('test123'),
        nama_lengkap: 'Test User',
        nip: 'TEST001',
        jabatan: 'Tester',
        instansi: 'Testing',
        role: 'USER',
        is_active: true
      }
    ]

    // Insert users
    for (const user of defaultUsers) {
      await db.user.create({
        data: user
      })
    }

    return NextResponse.json({ 
      message: 'Default users created successfully',
      users: [
        { username: 'admin', password: 'admin123', role: 'ADMIN' },
        { username: 'pimpinan', password: 'pimpinan123', role: 'PIMPINAN' },
        { username: 'petugas', password: 'petugas123', role: 'PETUGAS' },
        { username: 'user', password: 'user123', role: 'USER' },
        { username: 'testuser', password: 'test123', role: 'USER' }
      ]
    })
  } catch (error) {
    console.error('Error creating users:', error)
    return NextResponse.json(
      { error: 'Failed to create users' },
      { status: 500 }
    )
  }
}