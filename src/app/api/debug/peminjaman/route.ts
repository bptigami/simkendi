import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    console.log('Debug: Fetching peminjaman data...')
    
    // Get all peminjaman without relations first
    const peminjamanRaw = await db.peminjaman.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('Raw peminjaman count:', peminjamanRaw.length)
    
    // Get peminjaman with relations
    const peminjamanWithRelations = await db.peminjaman.findMany({
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
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('Peminjaman with relations count:', peminjamanWithRelations.length)
    
    // Check first item
    if (peminjamanWithRelations.length > 0) {
      const first = peminjamanWithRelations[0]
      console.log('First peminjaman:', {
        id: first.id_peminjaman,
        id_user_peminjam: first.id_user_peminjam,
        user_peminjam: first.user_peminjam,
        kendaraan: first.kendaraan ? first.kendaraan.plat_nomor : 'null'
      })
    }
    
    // Get all users to check
    const users = await db.user.findMany({
      select: {
        id_user: true,
        nama_lengkap: true,
        email: true,
        role: true
      }
    })
    
    console.log('Total users:', users.length)
    
    return NextResponse.json({
      peminjamanRaw: peminjamanRaw.map(p => ({
        id_peminjaman: p.id_peminjaman,
        id_user_peminjam: p.id_user_peminjam,
        id_kendaraan: p.id_kendaraan,
        status: p.status
      })),
      peminjamanWithRelations: peminjamanWithRelations.map(p => ({
        id_peminjaman: p.id_peminjaman,
        id_user_peminjam: p.id_user_peminjam,
        user_peminjam: p.user_peminjam,
        kendaraan: p.kendaraan ? {
          id_kendaraan: p.kendaraan.id_kendaraan,
          plat_nomor: p.kendaraan.plat_nomor
        } : null,
        status: p.status
      })),
      users: users,
      debug: {
        peminjamanCount: peminjamanRaw.length,
        peminjamanWithRelationsCount: peminjamanWithRelations.length,
        userCount: users.length
      }
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}