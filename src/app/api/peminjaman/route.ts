import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { put } from '@vercel/blob'

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
        peminjam: {
          select: {
            id_peminjam: true,
            nama_peminjam: true,
            nip: true,
            jabatan: true,
            instansi: true,
            kontak: true
          }
        },
        creator: {
          select: {
            id_user: true,
            nama_lengkap: true,
            email: true
          }
        },
        approver: {
          select: {
            id_user: true,
            nama_lengkap: true,
            email: true
          }
        },
        pengembalian: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const transformedPeminjaman = peminjaman.map(p => ({
      ...p,
      user_peminjam: p.peminjam ? {
        id_user: p.peminjam.id_peminjam,
        nama_lengkap: p.peminjam.nama_peminjam,
        nip: p.peminjam.nip,
        jabatan: p.peminjam.jabatan,
        instansi: p.peminjam.instansi,
        email: ''
      } : p.user_peminjam || null,
      peminjam: p.peminjam || (p.user_peminjam ? {
        id_peminjam: p.user_peminjam.id_user,
        nama_peminjam: p.user_peminjam.nama_lengkap,
        nip: p.user_peminjam.nip || 'N/A',
        instansi: p.user_peminjam.instansi || ''
      } : null)
    }))

    return NextResponse.json(transformedPeminjaman)
  } catch (error) {
    console.error('Error fetching peminjaman:', error)
    return NextResponse.json(
      { error: 'Failed to fetch peminjaman' },
      { status: 500 }
    )
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

    // Validasi input
    if (!id_kendaraan || !id_user_peminjam || !tanggal_pinjam || !tanggal_kembali_rencana || !tujuan_penggunaan || !tujuan_lokasi) {
      return NextResponse.json({ error: 'Semua field harus diisi' }, { status: 400 })
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(tanggal_pinjam) || !dateRegex.test(tanggal_kembali_rencana)) {
      return NextResponse.json({ error: 'Format tanggal tidak valid. Gunakan format YYYY-MM-DD' }, { status: 400 })
    }

    if (!pernyataan_keperluan_dinas || !pernyataan_kebersihan || !pernyataan_tanggung_jawab) {
      return NextResponse.json({ error: 'Semua pernyataan harus disetujui' }, { status: 400 })
    }

    if (new Date(tanggal_kembali_rencana) < new Date(tanggal_pinjam)) {
      return NextResponse.json({ error: 'Tanggal kembali tidak boleh sebelum tanggal pinjam' }, { status: 400 })
    }

    const kendaraan = await db.kendaraan.findUnique({
      where: { id_kendaraan: parseInt(id_kendaraan) }
    })

    if (!kendaraan) {
      return NextResponse.json({ error: 'Kendaraan tidak ditemukan' }, { status: 404 })
    }

    if (kendaraan.status !== 'Tersedia') {
      return NextResponse.json({ error: 'Kendaraan tidak tersedia untuk dipinjam' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { id_user: parseInt(id_user_peminjam) }
    })

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    // 📦 Upload file ke Vercel Blob
    let lampiran_nama = null
    let lampiran_path = null

    if (lampiran) {
      const buffer = Buffer.from(await lampiran.arrayBuffer())
      const timestamp = Date.now()
      const safeName = lampiran.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const uniqueName = `${timestamp}_${safeName}`

      // Upload ke Blob Storage
      const blob = await put(uniqueName, buffer, {
        access: 'public',
      })

      lampiran_nama = lampiran.name
      lampiran_path = blob.url // URL file di Blob Storage
    }

    // Simpan data ke database
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
        lampiran_path, // URL dari blob
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

    return NextResponse.json(peminjaman, { status: 201 })
  } catch (error) {
    console.error('Error creating peminjaman:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat peminjaman', details: error.message },
      { status: 500 }
    )
  }
}
