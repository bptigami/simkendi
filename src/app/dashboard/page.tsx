'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navigation } from '@/components/layout/Navigation'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { Button } from '@/components/ui/button'
import { Role } from '@prisma/client'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Navigation>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Selamat datang di Sistem Informasi Manajemen Kendaraan Dinas</p>
            </div>
            <ProtectedRoute resource="kendaraan">
              <div className="flex gap-2">
                <Button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/seed', { method: 'POST' })
                      if (response.ok) {
                        alert('Data contoh berhasil ditambahkan!')
                        window.location.reload()
                      }
                    } catch (error) {
                      console.error('Error seeding data:', error)
                    }
                  }}
                  variant="outline"
                  className="text-sm"
                >
                  Tambah Data Contoh
                </Button>
              </div>
            </ProtectedRoute>
          </div>
          
          <DashboardStats />
        </div>
      </Navigation>
    </ProtectedRoute>
  )
}
