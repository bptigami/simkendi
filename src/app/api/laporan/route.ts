import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')
    const format = searchParams.get('format') || 'json'

    // Build where clause
    let whereClause: any = {}
    
    if (startDate || endDate) {
      whereClause.tanggal_pinjam = {}
      if (startDate) {
        whereClause.tanggal_pinjam.gte = startDate
      }
      if (endDate) {
        whereClause.tanggal_pinjam.lte = endDate
      }
    }
    
    if (status && status !== 'all') {
      whereClause.status = status
    }

    // Fetch peminjaman data with relations
    const peminjaman = await db.peminjaman.findMany({
      where: whereClause,
      include: {
        kendaraan: true,
        user_peminjam: true,
        pengembalian: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate statistics
    const stats = {
      total: peminjaman.length,
      disetujui: peminjaman.filter(p => p.status === 'Disetujui').length,
      ditolak: peminjaman.filter(p => p.status === 'Ditolak').length,
      diproses: peminjaman.filter(p => p.status === 'Diproses').length,
      selesai: peminjaman.filter(p => p.status === 'Selesai').length,
      totalDurasi: 0,
      rataRataDurasi: 0
    }

    // Calculate average duration
    const completedPeminjaman = peminjaman.filter(p => p.status === 'Selesai' && p.pengembalian)
    if (completedPeminjaman.length > 0) {
      const totalDurasi = completedPeminjaman.reduce((sum, p) => {
        if (p.pengembalian) {
          const start = new Date(p.tanggal_pinjam)
          const end = new Date(p.pengembalian.tanggal_kembali)
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
          return sum + days
        }
        return sum
      }, 0)
      stats.totalDurasi = totalDurasi
      stats.rataRataDurasi = Math.round(totalDurasi / completedPeminjaman.length * 10) / 10
    }

    // Group by location
    const lokasiStats = peminjaman.reduce((acc: any, p) => {
      const lokasi = p.tujuan_lokasi
      if (!acc[lokasi]) {
        acc[lokasi] = { lokasi, count: 0 }
      }
      acc[lokasi].count++
      return acc
    }, {})

    // Group by vehicle
    const kendaraanStats = peminjaman.reduce((acc: any, p) => {
      const key = `${p.kendaraan.plat_nomor} - ${p.kendaraan.merek} ${p.kendaraan.tipe}`
      if (!acc[key]) {
        acc[key] = { kendaraan: key, count: 0 }
      }
      acc[key].count++
      return acc
    }, {})

    // Group by peminjam
    const peminjamStats = peminjaman.reduce((acc: any, p) => {
      const key = p.user_peminjam.nama_lengkap
      if (!acc[key]) {
        acc[key] = { peminjam: key, count: 0 }
      }
      acc[key].count++
      return acc
    }, {})

    const reportData = {
      filter: {
        startDate,
        endDate,
        status
      },
      stats,
      peminjaman: peminjaman.map(p => ({
        id_peminjaman: p.id_peminjaman,
        plat_nomor: p.kendaraan.plat_nomor,
        merek: p.kendaraan.merek,
        tipe: p.kendaraan.tipe,
        nama_peminjam: p.user_peminjam.nama_lengkap,
        nip: p.user_peminjam.nip || '',
        jabatan: p.user_peminjam.jabatan || '',
        instansi: p.user_peminjam.instansi || '',
        tanggal_pinjam: p.tanggal_pinjam,
        tanggal_kembali_rencana: p.tanggal_kembali_rencana,
        tanggal_kembali_aktual: p.pengembalian?.tanggal_kembali || null,
        tujuan_penggunaan: p.tujuan_penggunaan,
        tujuan_lokasi: p.tujuan_lokasi,
        status: p.status,
        kondisi_awal_layak: p.kondisi_awal_layak,
        kondisi_akhir_layak: p.pengembalian?.kondisi_akhir_layak || null,
        catatan_petugas: p.pengembalian?.catatan_petugas || null
      })),
      lokasiStats: Object.values(lokasiStats).sort((a: any, b: any) => b.count - a.count),
      kendaraanStats: Object.values(kendaraanStats).sort((a: any, b: any) => b.count - a.count),
      peminjamStats: Object.values(peminjamStats).sort((a: any, b: any) => b.count - a.count),
      generatedAt: new Date().toISOString()
    }

    if (format === 'csv') {
      // Generate CSV
      const headers = [
        'ID Peminjaman',
        'Plat Nomor',
        'Merek',
        'Tipe',
        'Nama Peminjam',
        'NIP',
        'Jabatan',
        'Instansi',
        'Tanggal Pinjam',
        'Tanggal Rencana Kembali',
        'Tanggal Aktual Kembali',
        'Tujuan Penggunaan',
        'Tujuan Lokasi',
        'Status',
        'Kondisi Awal',
        'Kondisi Akhir',
        'Catatan Petugas'
      ]

      const csvRows = [
        headers.join(','),
        ...reportData.peminjaman.map((row: any) => [
          row.id_peminjaman,
          row.plat_nomor,
          row.merek,
          row.tipe,
          row.nama_peminjam,
          row.nip,
          row.jabatan || '',
          row.instansi,
          row.tanggal_pinjam,
          row.tanggal_kembali_rencana,
          row.tanggal_kembali_aktual || '',
          `"${row.tujuan_penggunaan}"`,
          `"${row.tujuan_lokasi}"`,
          row.status,
          row.kondisi_awal_layak,
          row.kondisi_akhir_layak || '',
          `"${row.catatan_petugas || ''}"`
        ].join(','))
      ]

      const csvContent = csvRows.join('\n')
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="laporan-peminjaman-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}