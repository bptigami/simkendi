'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navigation } from '@/components/layout/Navigation'
import PeminjamanSystem from '@/components/peminjaman/PeminjamanSystem'

export default function PeminjamanPage() {
  return (
    <ProtectedRoute resource="peminjaman">
      <Navigation>
        <PeminjamanSystem />
      </Navigation>
    </ProtectedRoute>
  )
}