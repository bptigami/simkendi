import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const pengembalian = await db.pengembalian.findMany({
      include: {
        peminjaman: {
          include: {
            kendaraan: true,
            peminjam: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(pengembalian)
  } catch (error) {
    console.error('Error fetching pengembalian:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pengembalian' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id_peminjaman,
      tanggal_kembali,
      kondisi_akhir_layak,
      kondisi_akhir_kebersihan,
      kondisi_akhir_bensin,
      catatan_petugas
    } = body

    // Validasi input
    if (!id_peminjaman || !tanggal_kembali || !kondisi_akhir_layak || !kondisi_akhir_kebersihan || kondisi_akhir_bensin === undefined) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    // Cek apakah peminjaman ada dan disetujui
    const peminjaman = await db.peminjaman.findUnique({
      where: { id_peminjaman: parseInt(id_peminjaman) },
      include: { kendaraan: true }
    })

    if (!peminjaman) {
      return NextResponse.json(
        { error: 'Peminjaman tidak ditemukan' },
        { status: 404 }
      )
    }

    if (peminjaman.status !== 'Disetujui') {
      return NextResponse.json(
        { error: 'Peminjaman belum disetujui atau sudah selesai' },
        { status: 400 }
      )
    }

    // Cek apakah sudah ada pengembalian untuk peminjaman ini
    const existingPengembalian = await db.pengembalian.findUnique({
      where: { id_peminjaman: parseInt(id_peminjaman) }
    })

    if (existingPengembalian) {
      return NextResponse.json(
        { error: 'Peminjaman ini sudah dikembalikan' },
        { status: 400 }
      )
    }

    // Buat pengembalian
    const pengembalian = await db.pengembalian.create({
      data: {
        id_peminjaman: parseInt(id_peminjaman),
        tanggal_kembali,
        kondisi_akhir_layak,
        kondisi_akhir_kebersihan,
        kondisi_akhir_bensin: parseFloat(kondisi_akhir_bensin),
        catatan_petugas
      }
    })

    // Update status peminjaman menjadi Selesai
    await db.peminjaman.update({
      where: { id_peminjaman: parseInt(id_peminjaman) },
      data: { status: 'Selesai' }
    })

    // Update status kendaraan menjadi Tersedia dan update kondisi
    await db.kendaraan.update({
      where: { id_kendaraan: peminjaman.id_kendaraan },
      data: {
        status: 'Tersedia',
        kondisi_layak: kondisi_akhir_layak,
        kebersihan: kondisi_akhir_kebersihan,
        sisa_bensin: parseFloat(kondisi_akhir_bensin)
      }
    })

    return NextResponse.json(pengembalian, { status: 201 })
  } catch (error) {
    console.error('Error creating pengembalian:', error)
    return NextResponse.json(
      { error: 'Failed to create pengembalian' },
      { status: 500 }
    )
  }
}