'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navigation } from '@/components/layout/Navigation'
import LaporanSystem from '@/components/laporan/LaporanSystem'

export default function LaporanPage() {
  return (
    <ProtectedRoute resource="laporan">
      <Navigation>
        <LaporanSystem />
      </Navigation>
    </ProtectedRoute>
  )
}