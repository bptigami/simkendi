import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const kendaraan = await db.kendaraan.findUnique({
      where: { id_kendaraan: parseInt(id) }
    })

    if (!kendaraan) {
      return NextResponse.json(
        { error: 'Kendaraan not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(kendaraan)
  } catch (error) {
    console.error('Error fetching kendaraan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch kendaraan' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      plat_nomor,
      merek,
      tipe,
      tahun,
      kondisi_layak,
      kebersihan,
      sisa_bensin,
      status
    } = body

    // Cek apakah kendaraan ada
    const existingKendaraan = await db.kendaraan.findUnique({
      where: { id_kendaraan: parseInt(id) }
    })

    if (!existingKendaraan) {
      return NextResponse.json(
        { error: 'Kendaraan not found' },
        { status: 404 }
      )
    }

    // Cek apakah plat nomor sudah ada (jika diubah)
    if (plat_nomor && plat_nomor !== existingKendaraan.plat_nomor) {
      const duplicateKendaraan = await db.kendaraan.findUnique({
        where: { plat_nomor }
      })

      if (duplicateKendaraan) {
        return NextResponse.json(
          { error: 'Plat nomor sudah terdaftar' },
          { status: 400 }
        )
      }
    }

    const kendaraan = await db.kendaraan.update({
      where: { id_kendaraan: parseInt(id) },
      data: {
        ...(plat_nomor && { plat_nomor }),
        ...(merek && { merek }),
        ...(tipe && { tipe }),
        ...(tahun && { tahun: parseInt(tahun) }),
        ...(kondisi_layak && { kondisi_layak }),
        ...(kebersihan && { kebersihan }),
        ...(sisa_bensin !== undefined && { sisa_bensin: parseFloat(sisa_bensin) }),
        ...(status && { status })
      }
    })

    return NextResponse.json(kendaraan)
  } catch (error) {
    console.error('Error updating kendaraan:', error)
    return NextResponse.json(
      { error: 'Failed to update kendaraan' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    // Cek apakah kendaraan ada
    const existingKendaraan = await db.kendaraan.findUnique({
      where: { id_kendaraan: parseInt(id) }
    })

    if (!existingKendaraan) {
      return NextResponse.json(
        { error: 'Kendaraan not found' },
        { status: 404 }
      )
    }

    // Cek apakah kendaraan sedang dipinjam
    if (existingKendaraan.status === 'Dipinjam') {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus kendaraan yang sedang dipinjam' },
        { status: 400 }
      )
    }

    await db.kendaraan.delete({
      where: { id_kendaraan: parseInt(id) }
    })

    return NextResponse.json({ message: 'Kendaraan deleted successfully' })
  } catch (error) {
    console.error('Error deleting kendaraan:', error)
    return NextResponse.json(
      { error: 'Failed to delete kendaraan' },
      { status: 500 }
    )
  }
}