import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const peminjamanId = parseInt(id)
    const body = await request.json()
    const { approved, catatan } = body

    // Validasi input
    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'Status approval harus boolean' },
        { status: 400 }
      )
    }

    // Cek apakah peminjaman ada
    const peminjaman = await db.peminjaman.findUnique({
      where: { id_peminjaman: peminjamanId },
      include: {
        kendaraan: true
      }
    })

    if (!peminjaman) {
      return NextResponse.json(
        { error: 'Peminjaman tidak ditemukan' },
        { status: 404 }
      )
    }

    // Cek status peminjaman
    if (peminjaman.status !== 'Diproses') {
      return NextResponse.json(
        { error: 'Peminjaman sudah diproses sebelumnya' },
        { status: 400 }
      )
    }

    // Update peminjaman
    const updatedPeminjaman = await db.peminjaman.update({
      where: { id_peminjaman: peminjamanId },
      data: {
        status: approved ? 'Disetujui' : 'Ditolak',
        catatan_approval: catatan || null,
        tanggal_approval: new Date(),
        // Update status kendaraan jika disetujui
        ...(approved && {
          kendaraan: {
            update: {
              data: {
                status: 'Dipinjam'
              }
            }
          }
        })
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
      }
    })

    return NextResponse.json(updatedPeminjaman)
  } catch (error) {
    console.error('Error approving peminjaman:', error)
    return NextResponse.json(
      { error: 'Failed to approve peminjaman' },
      { status: 500 }
    )
  }
}