const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('Checking database connection...')
    
    // Check kendaraan table
    const kendaraanCount = await prisma.kendaraan.count()
    console.log(`Total kendaraan: ${kendaraanCount}`)
    
    if (kendaraanCount > 0) {
      const kendaraan = await prisma.kendaraan.findMany()
      console.log('Kendaraan data:')
      kendaraan.forEach(k => {
        console.log(`- ${k.plat_nomor}: ${k.merek} ${k.tipe} (${k.tahun}) - Status: ${k.status}`)
      })
    }
    
    // Check users table
    const usersCount = await prisma.user.count()
    console.log(`Total users: ${usersCount}`)
    
    if (usersCount > 0) {
      const users = await prisma.user.findMany()
      console.log('Users data:')
      users.forEach(u => {
        console.log(`- ${u.username}: ${u.nama_lengkap} (${u.role})`)
      })
    }
    
  } catch (error) {
    console.error('Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()