'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navigation } from '@/components/layout/Navigation'
import { Role } from '@prisma/client'
import { Button } from '@/components/ui/button'
import KendaraanManagement from '@/components/kendaraan/KendaraanManagement'
import PeminjamanSystem from '@/components/peminjaman/PeminjamanSystem'
import ApprovalSystem from '@/components/peminjaman/ApprovalSystem'
import PengembalianSystem from '@/components/peminjaman/PengembalianSystem'
import PeminjamManagement from '@/components/peminjam/PeminjamManagement'
import DashboardStats from '@/components/dashboard/DashboardStats'
import LaporanSystem from '@/components/laporan/LaporanSystem'
import { UserManagement } from '@/components/users/UserManagement'

export default function Home() {
  return (
    <ProtectedRoute>
      <Navigation>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Selamat datang di Sistem Informasi Manajemen Kendaraan Dinas (Sim-Kendi) BP3MI Jawa Tengah</p>
            </div>
            <ProtectedRoute resource="kendaraan">
              <div className="flex gap-2">
                <Button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/seed-users', { method: 'POST' })
                      if (response.ok) {
                        const data = await response.json()
                        alert(data.message || 'Users created successfully!')
                        window.location.reload()
                      }
                    } catch (error) {
                      console.error('Error seeding users:', error)
                    }
                  }}
                  variant="outline"
                  className="text-sm"
                >
                  Seed Users
                </Button>
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