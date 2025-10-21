import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action } = body // 'approve' or 'reject'

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    // Cek apakah peminjaman ada
    const peminjaman = await db.peminjaman.findUnique({
      where: { id_peminjaman: parseInt(id) },
      include: { kendaraan: true }
    })

    if (!peminjaman) {
      return NextResponse.json(
        { error: 'Peminjaman not found' },
        { status: 404 }
      )
    }

    if (peminjaman.status !== 'Diproses') {
      return NextResponse.json(
        { error: 'Peminjaman sudah diproses' },
        { status: 400 }
      )
    }

    const newStatus = action === 'approve' ? 'Disetujui' : 'Ditolak'
    const newKendaraanStatus = action === 'approve' ? 'Dipinjam' : 'Tersedia'

    // Update peminjaman status
    const updatedPeminjaman = await db.peminjaman.update({
      where: { id_peminjaman: parseInt(id) },
      data: { status: newStatus },
      include: {
        kendaraan: true,
        user_peminjam: true
      }
    })

    // Update kendaraan status if approved
    if (action === 'approve') {
      await db.kendaraan.update({
        where: { id_kendaraan: peminjaman.id_kendaraan },
        data: { status: newKendaraanStatus }
      })
    }

    return NextResponse.json(updatedPeminjaman)
  } catch (error) {
    console.error('Error updating peminjaman:', error)
    return NextResponse.json(
      { error: 'Failed to update peminjaman' },
      { status: 500 }
    )
  }
}