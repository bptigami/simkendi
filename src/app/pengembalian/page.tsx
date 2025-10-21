'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navigation } from '@/components/layout/Navigation'
import PengembalianSystem from '@/components/peminjaman/PengembalianSystem'

export default function PengembalianPage() {
  return (
    <ProtectedRoute resource="pengembalian">
      <Navigation>
        <PengembalianSystem />
      </Navigation>
    </ProtectedRoute>
  )
}