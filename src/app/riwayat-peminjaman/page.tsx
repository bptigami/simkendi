'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navigation } from '@/components/layout/Navigation'
import RiwayatPeminjaman from '@/components/riwayat-peminjaman/RiwayatPeminjaman'

export default function RiwayatPeminjamanPage() {
  return (
    <ProtectedRoute resource="riwayat-peminjaman">
      <Navigation>
        <RiwayatPeminjaman />
      </Navigation>
    </ProtectedRoute>
  )
}