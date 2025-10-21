import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { supabase } from '@/lib/supabase' // ⬅️ import harus di atas!

export async function GET() {
  try {
    const peminjaman = await db.peminjaman.findMany({
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
        },
        peminjam: true,
        creator: true,
        approver: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const transformed = peminjaman.map(p => ({
      ...p,
      user_peminjam: p.peminjam
        ? {
            id_user: p.peminjam.id_peminjam,
            nama_lengkap: p.peminjam.nama_peminjam,
            nip: p.peminjam.nip,
            jabatan: p.peminjam.jabatan,
            instansi: p.peminjam.instansi,
            email: ''
          }
        : p.user_peminjam || null
    }))

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Error fetching peminjaman:', error)
    return NextResponse.json({ error: 'Failed to fetch peminjaman' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const id_kendaraan = formData.get('id_kendaraan') as string
    const id_user_peminjam = formData.get('id_user_peminjam') as string
    const id_creator = formData.get('id_creator') as string
    const tanggal_pinjam = formData.get('tanggal_pinjam') as string
    const tanggal_kembali_rencana = formData.get('tanggal_kembali_rencana') as string
    const tujuan_penggunaan = formData.get('tujuan_penggunaan') as string
    const tujuan_lokasi = formData.get('tujuan_lokasi') as string
    const pernyataan_keperluan_dinas = formData.get('pernyataan_keperluan_dinas') === 'true'
    const pernyataan_kebersihan = formData.get('pernyataan_kebersihan') === 'true'
    const pernyataan_tanggung_jawab = formData.get('pernyataan_tanggung_jawab') === 'true'
    const lampiran = formData.get('lampiran') as File | null

    // Validasi dasar
    if (!id_kendaraan || !id_user_peminjam || !tanggal_pinjam || !tanggal_kembali_rencana) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }

    const kendaraan = await db.kendaraan.findUnique({
      where: { id_kendaraan: parseInt(id_kendaraan) }
    })
    if (!kendaraan) return NextResponse.json({ error: 'Kendaraan tidak ditemukan' }, { status: 404 })
    if (kendaraan.status !== 'Tersedia')
      return NextResponse.json({ error: 'Kendaraan tidak tersedia' }, { status: 400 })

    const user = await db.user.findUnique({
      where: { id_user: parseInt(id_user_peminjam) }
    })
    if (!user) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })

    // Upload file ke Supabase
    let lampiran_nama = null
    let lampiran_path = null

    if (lampiran) {
      const uniqueFileName = `${Date.now()}_${lampiran.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const arrayBuffer = await lampiran.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { data, error } = await supabase.storage
        .from('lampiran') // Pastikan nama bucket benar
        .upload(uniqueFileName, buffer, {
          contentType: lampiran.type || 'application/octet-stream',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Gagal upload file ke Supabase', details: error.message }, { status: 500 })
      }

      const { data: publicUrlData } = supabase.storage
        .from('lampiran')
        .getPublicUrl(uniqueFileName)

      lampiran_nama = lampiran.name
      lampiran_path = publicUrlData.publicUrl
    }

    // Simpan data peminjaman
    const peminjaman = await db.peminjaman.create({
      data: {
        id_kendaraan: parseInt(id_kendaraan),
        id_user_peminjam: parseInt(id_user_peminjam),
        id_creator: id_creator ? parseInt(id_creator) : null,
        tanggal_pinjam,
        tanggal_kembali_rencana,
        tujuan_penggunaan,
        tujuan_lokasi,
        kondisi_awal_layak: kendaraan.kondisi_layak,
        kondisi_awal_kebersihan: kendaraan.kebersihan,
        kondisi_awal_bensin: kendaraan.sisa_bensin,
        status: 'Diproses',
        pernyataan_keperluan_dinas,
        pernyataan_kebersihan,
        pernyataan_tanggung_jawab,
        lampiran_nama,
        lampiran_path
      },
      include: { kendaraan: true, user_peminjam: true }
    })

    return NextResponse.json(peminjaman, { status: 201 })
  } catch (error) {
    console.error('Error creating peminjaman:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat peminjaman', details: (error as Error).message },
      { status: 500 }
    )
  }
}
