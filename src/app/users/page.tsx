'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navigation } from '@/components/layout/Navigation'
import { UserManagement } from '@/components/users/UserManagement'

export default function UsersPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN" resource="users">
      <Navigation>
        <UserManagement />
      </Navigation>
    </ProtectedRoute>
  )
}