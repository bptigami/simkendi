import { db } from '@/lib/db'

async function addMorePeminjams() {
  try {
    // Additional peminjam data to match the 5 users
    const additionalPeminjams = [
      {
        nama_peminjam: 'Ahmad Wijaya',
        nip: '198505122005011001',
        jabatan: 'Supervisor',
        instansi: 'Logistics',
        kontak: '08567890123'
      },
      {
        nama_peminjam: 'Siti Nurhaliza',
        nip: '199003152015022001',
        jabatan: 'Coordinator',
        instansi: 'Human Resources',
        kontak: '08789012345'
      }
    ]

    // Add each peminjam
    for (const peminjamData of additionalPeminjams) {
      const existingPeminjam = await db.peminjam.findUnique({
        where: { nip: peminjamData.nip }
      })

      if (!existingPeminjam) {
        await db.peminjam.create({
          data: peminjamData
        })
        console.log(`Added peminjam: ${peminjamData.nama_peminjam}`)
      } else {
        console.log(`Peminjam with NIP ${peminjamData.nip} already exists`)
      }
    }

    // Check total after adding
    const totalPeminjam = await db.peminjam.count()
    console.log(`Total peminjam after adding: ${totalPeminjam}`)

    // Show all peminjam
    const allPeminjam = await db.peminjam.findMany({
      select: {
        id_peminjam: true,
        nama_peminjam: true,
        nip: true,
        instansi: true
      }
    })
    console.log('All peminjam:', allPeminjam)

  } catch (error) {
    console.error('Error adding peminjams:', error)
  } finally {
    await db.$disconnect()
  }
}

addMorePeminjams()