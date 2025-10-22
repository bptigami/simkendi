import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Role } from '@prisma/client'
import jwt from 'jsonwebtoken'

// Middleware to check if user is admin
async function isAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }

  const token = authHeader.substring(7)
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
  
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

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya admin yang bisa melakukan sinkronisasi.' },
        { status: 403 }
      )
    }

    // Get all users with roles PETUGAS, ADMIN, PIMPINAN
    const users = await db.user.findMany({
      where: {
        role: {
          in: [Role.PETUGAS, Role.ADMIN, Role.PIMPINAN]
        },
        is_active: true
      },
      select: {
        id_user: true,
        nama_lengkap: true,
        nip: true,
        jabatan: true,
        instansi: true,
        email: true,
        role: true
      }
    })

    console.log(`Found ${users.length} users with roles PETUGAS, ADMIN, PIMPINAN`)

    let created = 0
    let updated = 0
    let skipped = 0
    const results = []

    for (const user of users) {
      try {
        // Check if peminjam already exists for this user (by NIP or nama)
        let existingPeminjam = null
        
        if (user.nip) {
          existingPeminjam = await db.peminjam.findUnique({
            where: { nip: user.nip }
          })
        } else {
          // If no NIP, check by name
          existingPeminjam = await db.peminjam.findFirst({
            where: { nama_peminjam: user.nama_lengkap }
          })
        }

        const peminjamData = {
          nama_peminjam: user.nama_lengkap,
          nip: user.nip || `${user.role.toLowerCase()}-${user.id_user}`, // Generate NIP if not exists
          jabatan: user.jabatan || user.role,
          instansi: user.instansi || 'Instansi Default',
          kontak: user.email
        }

        if (existingPeminjam) {
          // Update existing peminjam
          const updatedPeminjam = await db.peminjam.update({
            where: { id_peminjam: existingPeminjam.id_peminjam },
            data: {
              ...peminjamData,
              updatedAt: new Date()
            }
          })
          updated++
          results.push({
            action: 'updated',
            user: user.nama_lengkap,
            peminjamId: updatedPeminjam.id_peminjam
          })
        } else {
          // Create new peminjam
          const newPeminjam = await db.peminjam.create({
            data: peminjamData
          })
          created++
          results.push({
            action: 'created',
            user: user.nama_lengkap,
            peminjamId: newPeminjam.id_peminjam
          })
        }
      } catch (error) {
        console.error(`Error processing user ${user.nama_lengkap}:`, error)
        skipped++
        results.push({
          action: 'skipped',
          user: user.nama_lengkap,
          error: error.message
        })
      }
    }

    return NextResponse.json({
      message: 'Sinkronisasi selesai',
      summary: {
        totalUsers: users.length,
        created,
        updated,
        skipped
      },
      results
    })

  } catch (error) {
    console.error('Sync peminjam error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat sinkronisasi data peminjam' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin access
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya admin yang bisa melihat data sinkronisasi.' },
        { status: 403 }
      )
    }

    // Get sync status
    const [totalUsers, totalPeminjams] = await Promise.all([
      // Total users with target roles
      db.user.count({
        where: {
          role: {
            in: [Role.PETUGAS, Role.ADMIN, Role.PIMPINAN]
          },
          is_active: true
        }
      }),
      // Total peminjams
      db.peminjam.count()
    ])

    // Get detailed sync info
    const usersWithRoles = await db.user.findMany({
      where: {
        role: {
          in: [Role.PETUGAS, Role.ADMIN, Role.PIMPINAN]
        },
        is_active: true
      },
      select: {
        id_user: true,
        nama_lengkap: true,
        nip: true,
        role: true,
        email: true
      }
    })

    const syncDetails = await Promise.all(
      usersWithRoles.map(async (user) => {
        let peminjam = null
        
        if (user.nip) {
          peminjam = await db.peminjam.findUnique({
            where: { nip: user.nip }
          })
        }
        
        if (!peminjam) {
          peminjam = await db.peminjam.findFirst({
            where: { nama_peminjam: user.nama_lengkap }
          })
        }

        return {
          user: {
            id: user.id_user,
            name: user.nama_lengkap,
            nip: user.nip,
            role: user.role,
            email: user.email
          },
          peminjam: peminjam ? {
            id: peminjam.id_peminjam,
            name: peminjam.nama_peminjam,
            nip: peminjam.nip,
            instansi: peminjam.instansi
          } : null,
          synced: !!peminjam
        }
      })
    )

    const syncedUsers = syncDetails.filter(detail => detail.synced).length

    return NextResponse.json({
      summary: {
        totalUsers,
        totalPeminjams,
        syncedUsers,
        unsyncedUsers: totalUsers - syncedUsers
      },
      details: syncDetails
    })

  } catch (error) {
    console.error('Get sync status error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil status sinkronisasi' },
      { status: 500 }
    )
  }
}