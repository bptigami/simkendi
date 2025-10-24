'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Shield, Users, Database } from 'lucide-react'

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSeedUsers = async () => {
    setIsLoading(true)
    setError('')
    setMessage('')
    
    try {
      const response = await fetch('/api/seed-users', { method: 'POST' })
      const data = await response.json()
      
      if (response.ok) {
        setMessage(data.message || 'Users created successfully!')
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      } else {
        setError(data.error || 'Failed to create users')
      }
    } catch (error) {
      setError('Failed to create users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeedData = async () => {
    setIsLoading(true)
    setError('')
    setMessage('')
    
    try {
      const response = await fetch('/api/seed', { method: 'POST' })
      const data = await response.json()
      
      if (response.ok) {
        setMessage(data.message || 'Sample data created successfully!')
      } else {
        setError(data.error || 'Failed to create sample data')
      }
    } catch (error) {
      setError('Failed to create sample data')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <img 
              src="https://kp2mi.go.id/assets/dist/img/logo_kp2mi-ntxt.png" 
              alt="Sim-Kendi Logo" 
              className="h-16 w-16"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Sim-Kendi
          </CardTitle>
          <CardDescription className="text-lg">
            Setup Awal Sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                {message}
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <Card className="border-2 border-dashed border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Buat User Default
                </CardTitle>
                <CardDescription>
                  Membuat user default untuk pertama kali. Ini diperlukan untuk bisa login ke sistem.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p className="font-medium mb-2">User yang akan dibuat:</p>
                    <ul className="space-y-1 text-xs">
                      <li><strong>admin</strong> / admin123 (Administrator)</li>
                      <li><strong>pimpinan</strong> / pimpinan123 (Pimpinan)</li>
                      <li><strong>petugas</strong> / petugas123 (Petugas)</li>
                      <li><strong>user</strong> / user123 (User)</li>
                      <li><strong>testuser</strong> / test123 (Test User)</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={handleSeedUsers}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Users...
                      </>
                    ) : (
                      'Buat User Default'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-gray-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="h-5 w-5" />
                  Tambah Data Contoh
                </CardTitle>
                <CardDescription>
                  Menambahkan data contoh untuk kendaraan dan peminjam.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleSeedData}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Data...
                    </>
                  ) : (
                    'Tambah Data Contoh'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Setelah membuat user, Anda bisa login dengan <strong>testuser / test123</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}