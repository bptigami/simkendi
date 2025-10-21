'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navigation } from '@/components/layout/Navigation'
import KendaraanManagement from '@/components/kendaraan/KendaraanManagement'

export default function KendaraanPage() {
  return (
    <ProtectedRoute resource="kendaraan">
      <Navigation>
        <KendaraanManagement />
      </Navigation>
    </ProtectedRoute>
  )
}