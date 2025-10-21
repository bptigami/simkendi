import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get token from header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify token and get user
    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Build query based on user role
    const whereClause = user.role === 'USER' 
      ? {
          OR: [
            { id_user_peminjam: user.id_user },
            { id_creator: user.id_user }
          ]
        }
      : {}

    const peminjaman = await db.peminjaman.findMany({
      where: whereClause,
      include: {
        kendaraan: true,
        user_peminjam: {
          select: {
            id_user: true,
            nama_lengkap: true,
            nip: true,
            jabatan: true,
            instansi: true,
            email: true
          }
        },
        peminjam: {
          select: {
            id_peminjam: true,
            nama_peminjam: true,
            nip: true,
            jabatan: true,
            instansi: true,
            kontak: true
          }
        },
        creator: {
          select: {
            id_user: true,
            nama_lengkap: true,
            email: true
          }
        },
        approver: {
          select: {
            id_user: true,
            nama_lengkap: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Transform data to ensure consistent structure
    const transformedPeminjaman = peminjaman.map(p => ({
      ...p,
      // Prioritize peminjam data over user_peminjam
      user_peminjam: p.peminjam ? {
        id_user: p.peminjam.id_peminjam,
        nama_lengkap: p.peminjam.nama_peminjam,
        nip: p.peminjam.nip,
        jabatan: p.peminjam.jabatan,
        instansi: p.peminjam.instansi,
        email: '' // Peminjam doesn't have email
      } : p.user_peminjam || null,
      // Add peminjam fallback for compatibility
      peminjam: p.peminjam || (p.user_peminjam ? {
        id_peminjam: p.user_peminjam.id_user,
        nama_peminjam: p.user_peminjam.nama_lengkap,
        nip: p.user_peminjam.nip || 'N/A',
        instansi: p.user_peminjam.instansi || ''
      } : null)
    }))
    
    return NextResponse.json(transformedPeminjaman)
  } catch (error) {
    console.error('Error fetching riwayat peminjaman:', error)
    return NextResponse.json(
      { error: 'Failed to fetch riwayat peminjaman' },
      { status: 500 }
    )
  }
}