'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Role } from '@prisma/client'
import { LoginForm } from './LoginForm'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: Role | Role[]
  resource?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  resource,
  fallback 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, hasRole, canAccess } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return null
  }

  // Check resource-based access
  if (resource && !canAccess(resource)) {
    return null
  }

  return <>{children}</>
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { requiredRole?: Role | Role[]; resource?: string }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute 
        requiredRole={options?.requiredRole}
        resource={options?.resource}
      >
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}