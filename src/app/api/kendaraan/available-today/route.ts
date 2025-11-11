import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for date range
    const { searchParams } = new URL(request.url)
    const tanggalMulai = searchParams.get('tanggal_mulai')
    const tanggalSelesai = searchParams.get('tanggal_selesai')

    // Get all vehicles that are not in maintenance
    const allVehicles = await db.kendaraan.findMany({
      where: {
        status: {
          not: 'Dalam Perawatan'
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // If no dates provided, return all vehicles (for initial load)
    if (!tanggalMulai || !tanggalSelesai) {
      return NextResponse.json(allVehicles)
    }

    // Get active peminjaman for the selected date range
    const activePeminjamanInRange = await db.peminjaman.findMany({
      where: {
        AND: [
          // Peminjaman yang overlap dengan tanggal yang dipilih
          {
            AND: [
              { tanggal_pinjam: { lte: tanggalSelesai } },
              { 
                OR: [
                  { tanggal_kembali_rencana: { gte: tanggalMulai } }
                ]
              }
            ]
          },
          // Hanya status yang benar-benar mengikat kendaraan (Disetujui dan Dipinjamkan)
          // Status "Diproses" tidak memblokir karena belum disetujui
          { status: { in: ['Disetujui', 'Dipinjamkan'] } },
          // Belum ada pengembalian
          { pengembalian: null }
        ]
      },
      include: {
        kendaraan: true,
        pengembalian: true
      }
    })

    // Create a set of vehicle IDs that are borrowed in the selected date range
    const borrowedVehicleIds = new Set()
    activePeminjamanInRange.forEach(p => {
      borrowedVehicleIds.add(p.id_kendaraan)
    })

    // Filter vehicles: exclude those that are borrowed in the selected date range
    const availableVehicles = allVehicles.filter(vehicle => 
      !borrowedVehicleIds.has(vehicle.id_kendaraan)
    )

    return NextResponse.json(availableVehicles)
  } catch (error) {
    console.error('Error fetching available vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available vehicles' },
      { status: 500 }
    )
  }
}