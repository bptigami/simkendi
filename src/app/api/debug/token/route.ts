import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    console.log('Debug - Received token:', token)
    console.log('Debug - JWT_SECRET:', JWT_SECRET)

    // Try direct JWT verification
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      console.log('Debug - Direct JWT decode success:', decoded)
    } catch (jwtError) {
      console.log('Debug - Direct JWT decode failed:', jwtError.message)
    }

    // Try verifyToken function
    try {
      const user = await verifyToken(token)
      console.log('Debug - verifyToken result:', user)
      
      if (user) {
        return NextResponse.json({
          success: true,
          user: user
        })
      } else {
        return NextResponse.json({
          success: false,
          error: 'User not found or inactive'
        })
      }
    } catch (verifyError) {
      console.log('Debug - verifyToken error:', verifyError.message)
      return NextResponse.json({
        success: false,
        error: verifyError.message
      })
    }

  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    })
  }
}