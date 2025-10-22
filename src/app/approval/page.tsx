'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navigation } from '@/components/layout/Navigation'
import ApprovalSystem from '@/components/peminjaman/ApprovalSystem'

export default function ApprovalPage() {
  return (
    <ProtectedRoute requiredRole={['PIMPINAN', 'ADMIN']} resource="approval">
      <Navigation>
        <ApprovalSystem />
      </Navigation>
    </ProtectedRoute>
  )
}