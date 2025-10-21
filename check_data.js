import { db } from '@/lib/db'

async function checkData() {
  try {
    // Check total peminjam
    const totalPeminjam = await db.peminjam.count()
    console.log('Total peminjam:', totalPeminjam)
    
    // Get all peminjam
    const allPeminjam = await db.peminjam.findMany({
      select: {
        id_peminjam: true,
        nama_peminjam: true,
        nip: true,
        instansi: true
      }
    })
    console.log('All peminjam:', allPeminjam)
    
    // Check total users
    const totalUsers = await db.user.count()
    console.log('Total users:', totalUsers)
    
    // Get all users
    const allUsers = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })
    console.log('All users:', allUsers)
    
    // Check peminjaman data
    const totalPeminjaman = await db.peminjaman.count()
    console.log('Total peminjaman:', totalPeminjaman)
    
    // Get peminjaman with peminjam relation
    const peminjamanWithPeminjam = await db.peminjaman.findMany({
      select: {
        id_peminjaman: true,
        tujuan: true,
        status: true,
        peminjam: {
          select: {
            nama_peminjam: true
          }
        }
      },
      take: 5
    })
    console.log('Peminjaman with peminjam:', peminjamanWithPeminjam)
    
  } catch (error) {
    console.error('Error checking data:', error)
  } finally {
    await db.$disconnect()
  }
}

checkData()