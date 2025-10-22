import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    // Sample data for peminjam
    const samplePeminjam = [
      {
        nama_peminjam: 'Ahmad Rizki',
        nip: '1987654321',
        jabatan: 'Kepala Divisi IT',
        instansi: 'Dinas Teknologi Informasi',
        kontak: '0812-3456-7890'
      },
      {
        nama_peminjam: 'Siti Nurhaliza',
        nip: '1976543210',
        jabatan: 'Staff Administrasi',
        instansi: 'Dinas Umum',
        kontak: '0813-5678-9012'
      },
      {
        nama_peminjam: 'Budi Santoso',
        nip: '1998765432',
        jabatan: 'Driver',
        instansi: 'Dinas Transportasi',
        kontak: '0814-6789-0123'
      },
      {
        nama_peminjam: 'Dewi Lestari',
        nip: '1995432109',
        jabatan: 'Kepala Seksi',
        instansi: 'Dinas Pendidikan',
        kontak: '0815-7890-1234'
      },
      {
        nama_peminjam: 'Eko Prasetyo',
        nip: '1994321098',
        jabatan: 'Analis',
        instansi: 'Dinas Keuangan',
        kontak: '0816-8901-2345'
      },
      {
        nama_peminjam: 'Fitri Handayani',
        nip: '1993210987',
        jabatan: 'Staff',
        instansi: 'Dinas Kesehatan',
        kontak: '0817-9012-3456'
      },
      {
        nama_peminjam: 'Gunawan Wijaya',
        nip: '1992109876',
        jabatan: 'Kepala Bidang',
        instansi: 'Dinas Pekerjaan Umum',
        kontak: '0818-0123-4567'
      },
      {
        nama_peminjam: 'Hana Permata',
        nip: '1991098765',
        jabatan: 'Sekretaris',
        instansi: 'Dinas Sosial',
        kontak: '0819-1234-5678'
      }
    ]

    // Sample data for kendaraan
    const sampleKendaraan = [
      {
        plat_nomor: 'B 1234 CD',
        merek: 'Toyota',
        tipe: 'Avanza',
        tahun: 2022,
        kondisi_layak: 'Layak',
        kebersihan: 'Bersih',
        sisa_bensin: 25.5,
        status: 'Tersedia'
      },
      {
        plat_nomor: 'B 5678 EF',
        merek: 'Honda',
        tipe: 'CR-V',
        tahun: 2023,
        kondisi_layak: 'Layak',
        kebersihan: 'Bersih',
        sisa_bensin: 40.0,
        status: 'Tersedia'
      },
      {
        plat_nomor: 'B 9012 GH',
        merek: 'Suzuki',
        tipe: 'Ertiga',
        tahun: 2021,
        kondisi_layak: 'Layak',
        kebersihan: 'Perlu Dibersihkan',
        sisa_bensin: 15.0,
        status: 'Dalam Perawatan'
      }
    ]

    // Insert sample peminjam
    for (const peminjam of samplePeminjam) {
      await db.peminjam.upsert({
        where: { nip: peminjam.nip },
        update: peminjam,
        create: peminjam
      })
    }

    // Insert sample kendaraan
    for (const kendaraan of sampleKendaraan) {
      await db.kendaraan.upsert({
        where: { plat_nomor: kendaraan.plat_nomor },
        update: kendaraan,
        create: kendaraan
      })
    }

    return NextResponse.json({ message: 'Sample data inserted successfully' })
  } catch (error) {
    console.error('Error inserting sample data:', error)
    return NextResponse.json(
      { error: 'Failed to insert sample data' },
      { status: 500 }
    )
  }
}