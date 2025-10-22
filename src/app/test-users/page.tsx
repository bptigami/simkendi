'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface User {
  username: string
  password: string
  role: string
  nama: string
}

export default function TestUserPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const createTestUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-test-user')
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users)
        alert('Pengguna tes berhasil dibuat!')
      } else {
        alert('Gagal membuat pengguna tes')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    createTestUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Akun Test untuk Sistem</CardTitle>
          <CardDescription>
            Berikut adalah akun yang dapat digunakan untuk testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {users.map((user, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold text-lg">{user.nama}</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Username:</span> {user.username}</p>
                <p><span className="font-medium">Password:</span> {user.password}</p>
                <p><span className="font-medium">Role:</span> {user.role}</p>
              </div>
            </div>
          ))}
          
          <Button 
            onClick={createTestUsers} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Memuat...' : 'Reset Akun Test'}
          </Button>
          
          <div className="text-xs text-gray-500 text-center">
            <p>Gunakan akun di atas untuk login ke sistem</p>
            <p>Admin dapat mengakses semua fitur</p>
            <p>User dapat mengajukan peminjaman kendaraan</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}