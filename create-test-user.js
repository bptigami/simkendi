import { db } from '@/lib/db'

async function createTestUser() {
  try {
    // Create test user with USER role
    const testUser = await db.user.create({
      data: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123', // In production, this should be hashed
        nama: 'Test User',
        role: 'USER',
        noTelepon: '08123456789',
        alamat: 'Jl. Test No. 123'
      }
    })

    console.log('Test user created:', testUser)
  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await db.$disconnect()
  }
}

createTestUser()