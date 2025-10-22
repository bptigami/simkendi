import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const peminjamanId = parseInt(id)
    
    if (isNaN(peminjamanId)) {
      return NextResponse.json(
        { error: 'ID peminjaman tidak valid' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { 
      kondisi_akhir_layak, 
      kondisi_akhir_kebersihan, 
      kondisi_akhir_bensin, 
      catatan_petugas 
    } = body

    // Validasi input
    if (!kondisi_akhir_layak || !kondisi_akhir_kebersihan || kondisi_akhir_bensin === undefined) {
      return NextResponse.json(
        { error: 'Semua field kondisi harus diisi' },
        { status: 400 }
      )
    }

    // Cek apakah peminjaman ada dan statusnya disetujui
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

    if (peminjaman.status !== 'Disetujui') {
      return NextResponse.json(
        { error: 'Hanya peminjaman yang disetujui yang dapat dikembalikan' },
        { status: 400 }
      )
    }

    // Cek apakah sudah pernah dikembalikan
    const existingPengembalian = await db.pengembalian.findUnique({
      where: { id_peminjaman: peminjamanId }
    })

    if (existingPengembalian) {
      return NextResponse.json(
        { error: 'Peminjaman ini sudah dikembalikan' },
        { status: 400 }
      )
    }

    // Buat pengembalian baru
    const pengembalian = await db.pengembalian.create({
      data: {
        id_peminjaman: peminjamanId,
        tanggal_kembali: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
        kondisi_akhir_layak,
        kondisi_akhir_kebersihan,
        kondisi_akhir_bensin: parseFloat(kondisi_akhir_bensin.toString()),
        catatan_petugas: catatan_petugas || null,
        // id_petugas bisa diisi nanti jika ada sistem autentikasi
      }
    })

    // Update status peminjaman menjadi Selesai
    await db.peminjaman.update({
      where: { id_peminjaman: peminjamanId },
      data: { 
        status: 'Selesai',
        updatedAt: new Date()
      }
    })

    // Update status kendaraan menjadi Tersedia
    await db.kendaraan.update({
      where: { id_kendaraan: peminjaman.id_kendaraan },
      data: { 
        status: 'Tersedia',
        kondisi_layak: kondisi_akhir_layak,
        kebersihan: kondisi_akhir_kebersihan,
        sisa_bensin: parseFloat(kondisi_akhir_bensin.toString()),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Pengembalian berhasil diproses',
      pengembalian
    })

  } catch (error) {
    console.error('Error processing pengembalian:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses pengembalian' },
      { status: 500 }
    )
  }
}