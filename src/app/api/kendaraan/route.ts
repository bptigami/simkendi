import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const kendaraan = await db.kendaraan.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(kendaraan)
  } catch (error) {
    console.error('Error fetching kendaraan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch kendaraan' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      plat_nomor,
      merek,
      tipe,
      tahun,
      kondisi_layak = 'Layak',
      kebersihan = 'Bersih',
      sisa_bensin = 0,
      status = 'Tersedia'
    } = body

    // Validasi input
    if (!plat_nomor || !merek || !tipe || !tahun) {
      return NextResponse.json(
        { error: 'Plat nomor, merek, tipe, dan tahun harus diisi' },
        { status: 400 }
      )
    }

    // Cek apakah plat nomor sudah ada
    const existingKendaraan = await db.kendaraan.findUnique({
      where: { plat_nomor }
    })

    if (existingKendaraan) {
      return NextResponse.json(
        { error: 'Plat nomor sudah terdaftar' },
        { status: 400 }
      )
    }

    const kendaraan = await db.kendaraan.create({
      data: {
        plat_nomor,
        merek,
        tipe,
        tahun: parseInt(tahun),
        kondisi_layak,
        kebersihan,
        sisa_bensin: parseFloat(sisa_bensin),
        status
      }
    })

    return NextResponse.json(kendaraan, { status: 201 })
  } catch (error) {
    console.error('Error creating kendaraan:', error)
    return NextResponse.json(
      { error: 'Failed to create kendaraan' },
      { status: 500 }
    )
  }
}