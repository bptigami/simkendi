import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get user info from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    let currentUser = null
    
    if (token) {
      try {
        currentUser = await verifyToken(token)
        console.log('Dashboard API - User object:', currentUser)
      } catch (error) {
        console.error('Token verification failed:', error)
      }
    }

    // Total kendaraan
    const totalKendaraan = await db.kendaraan.count()

    // Kendaraan tersedia
    const kendaraanTersedia = await db.kendaraan.count({
      where: { status: 'Tersedia' }
    })

    // Kendaraan dipinjam
    const kendaraanDipinjam = await db.kendaraan.count({
      where: { status: 'Dipinjam' }
    })

    // Kendaraan dalam perawatan
    const kendaraanPerawatan = await db.kendaraan.count({
      where: { status: 'Dalam Perawatan' }
    })

    // Kendaraan layak
    const kendaraanLayak = await db.kendaraan.count({
      where: { kondisi_layak: 'Layak' }
    })

    // Persentase kendaraan layak
    const persentaseLayak = totalKendaraan > 0 ? (kendaraanLayak / totalKendaraan) * 100 : 0

    // Peminjaman bulan ini
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    
    const peminjamanBulanIni = await db.peminjaman.count({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`),
          lt: new Date(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`)
        }
      }
    })

    // Peminjaman hari ini
    const today = new Date().toISOString().split('T')[0]
    const peminjamanHariIni = await db.peminjaman.findMany({
      where: {
        tanggal_pinjam: today
      },
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
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Statistik lokasi tujuan
    const lokasiStats = await db.peminjaman.groupBy({
      by: ['tujuan_lokasi'],
      where: {
        status: 'Selesai'
      },
      _count: {
        tujuan_lokasi: true
      },
      orderBy: {
        _count: {
          tujuan_lokasi: 'desc'
        }
      },
      take: 10
    })

    // Statistik peminjaman per divisi
    const divisiStats = await db.peminjaman.groupBy({
      by: ['tujuan_penggunaan'],
      where: {
        status: 'Selesai'
      },
      _count: {
        tujuan_penggunaan: true
      },
      orderBy: {
        _count: {
          tujuan_penggunaan: 'desc'
        }
      },
      take: 5
    })

    // Kendaraan populer
    const kendaraanPopuler = await db.peminjaman.groupBy({
      by: ['id_kendaraan'],
      where: {
        status: 'Selesai'
      },
      _count: {
        id_kendaraan: true
      },
      orderBy: {
        _count: {
          id_kendaraan: 'desc'
        }
      },
      take: 5
    })

    // Get kendaraan details for popular vehicles
    const popularKendaraanDetails = await Promise.all(
      kendaraanPopuler.map(async (item) => {
        const kendaraan = await db.kendaraan.findUnique({
          where: { id_kendaraan: item.id_kendaraan }
        })
        return {
          ...kendaraan,
          count: item._count.id_kendaraan
        }
      })
    )

    // Total users (peminjam)
    const totalPeminjam = await db.user.count({
      where: {
        role: 'USER'
      }
    })

    // Users aktif bulan ini (yang pernah pinjam)
    const userAktifBulanIni = await db.peminjaman.groupBy({
      by: ['id_user_peminjam'],
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`),
          lt: new Date(`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`)
        }
      },
      _count: {
        id_user_peminjam: true
      }
    })

    // Statistik instansi dari users
    const instansiStats = await db.user.groupBy({
      by: ['instansi'],
      where: {
        instansi: {
          not: null
        }
      },
      _count: {
        instansi: true
      },
      orderBy: {
        _count: {
          instansi: 'desc'
        }
      },
      take: 5
    })

    // User teraktif
    const userTeraktif = await db.peminjaman.groupBy({
      by: ['id_user_peminjam'],
      where: {
        status: 'Selesai'
      },
      _count: {
        id_user_peminjam: true
      },
      orderBy: {
        _count: {
          id_user_peminjam: 'desc'
        }
      },
      take: 5
    })

    // Get user details for most active borrowers
    const activeUserDetails = await Promise.all(
      userTeraktif.map(async (item) => {
        const userDetail = await db.user.findUnique({
          where: { id_user: item.id_user_peminjam },
          select: {
            id_user: true,
            nama_lengkap: true,
            nip: true,
            instansi: true,
            email: true
          }
        })
        return {
          ...userDetail,
          count: item._count.id_user_peminjam
        }
      })
    )

    // Base statistics for all roles
    const baseStatistics = {
      totalKendaraan,
      kendaraanTersedia,
      kendaraanDipinjam,
      kendaraanPerawatan,
      persentaseLayak: Math.round(persentaseLayak * 10) / 10,
      peminjamanBulanIni,
      peminjamanHariIni,
      lokasiStats,
      divisiStats,
      kendaraanPopuler: popularKendaraanDetails,
      totalPeminjam,
      peminjamAktifBulanIni: userAktifBulanIni.length,
      instansiStats,
      peminjamTeraktif: activeUserDetails
    }

    // Role-specific data
    if (currentUser && currentUser.role === 'USER') {
      // For USER role, get their specific peminjaman data
      const userPeminjaman = await db.peminjaman.findMany({
        where: {
          id_user_peminjam: currentUser.id_user
        },
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
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      })

      return NextResponse.json({
        ...baseStatistics,
        userPeminjaman
      })
    }

    if (currentUser && currentUser.role === 'PIMPINAN') {
      // For PIMPINAN role, get pending approvals count
      const pendingApprovals = await db.peminjaman.count({
        where: {
          status: 'Diproses'
        }
      })

      return NextResponse.json({
        ...baseStatistics,
        pendingApprovals
      })
    }

    // For ADMIN, PETUGAS, or no user - return all data
    return NextResponse.json(baseStatistics)

  } catch (error) {
    console.error('Error fetching dashboard statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}