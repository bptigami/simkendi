'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Role } from '@prisma/client'

interface User {
  id_user: number
  username: string
  email: string
  nama_lengkap: string
  nip?: string
  jabatan?: string
  instansi?: string
  role: Role
  is_active: boolean
  last_login?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
  isAuthenticated: boolean
  hasRole: (role: Role | Role[]) => boolean
  canAccess: (resource: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      verifyToken(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (authToken: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: authToken }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.valid) {
          setUser(data.user)
          setToken(authToken)
          localStorage.setItem('auth_token', authToken)
        } else {
          localStorage.removeItem('auth_token')
        }
      } else {
        localStorage.removeItem('auth_token')
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      localStorage.removeItem('auth_token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem('auth_token', data.token)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: 'Terjadi kesalahan saat login' }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
  }

  const hasRole = (role: Role | Role[]): boolean => {
    if (!user) return false
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    return user.role === role
  }

  const canAccess = (resource: string): boolean => {
    if (!user) return false

    // Define access control matrix
    const accessMatrix: Record<Role, string[]> = {
      ADMIN: [
        'dashboard', 'kendaraan', 'peminjaman', 'approval', 
        'pengembalian', 'riwayat-peminjaman', 'laporan', 'users', 'settings'
      ],
      PIMPINAN: [
        'dashboard', 'peminjaman', 'approval', 'riwayat-peminjaman', 'laporan', 'settings'
      ],
      PETUGAS: [
        'dashboard', 'kendaraan', 'peminjaman', 'pengembalian', 'riwayat-peminjaman', 'settings'
      ],
      USER: [
        'dashboard', 'peminjaman', 'riwayat-peminjaman', 'settings'
      ]
    }

    return accessMatrix[user.role]?.includes(resource) || false
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    hasRole,
    canAccess
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}