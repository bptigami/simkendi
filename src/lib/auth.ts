import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Get user from database
    const user = await db.user.findUnique({
      where: { id_user: decoded.userId },
      select: {
        id_user: true,
        username: true,
        email: true,
        nama_lengkap: true,
        nip: true,
        jabatan: true,
        instansi: true,
        role: true,
        is_active: true,
        last_login: true,
        createdAt: true
      }
    })

    if (!user || !user.is_active) {
      return null
    }

    return user
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}