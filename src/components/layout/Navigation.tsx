'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Role } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  User,
  Shield,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  requiredRole?: Role | Role[]
  resource?: string
}

interface NavigationProps {
  children: React.ReactNode
}

export function Navigation({ children }: NavigationProps) {
  const { user, logout, hasRole, canAccess } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      resource: 'dashboard'
    },
    {
      name: 'Kendaraan',
      href: '/kendaraan',
      icon: Building,
      resource: 'kendaraan'
    },
    {
      name: 'Peminjaman',
      href: '/peminjaman',
      icon: FileText,
      resource: 'peminjaman'
    },
    {
      name: 'Approval',
      href: '/approval',
      icon: Shield,
      requiredRole: ['PIMPINAN', 'ADMIN'],
      resource: 'approval'
    },
    {
      name: 'Pengembalian',
      href: '/pengembalian',
      icon: FileText,
      resource: 'pengembalian'
    },
    {
      name: 'Riwayat Peminjaman',
      href: '/riwayat-peminjaman',
      icon: FileText,
      resource: 'riwayat-peminjaman'
    },
    {
      name: 'Laporan',
      href: '/laporan',
      icon: FileText,
      resource: 'laporan'
    },
    {
      name: 'Manajemen User',
      href: '/users',
      icon: Users,
      requiredRole: 'ADMIN',
      resource: 'users'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      resource: 'settings'
    }
  ]

  const filteredNavigation = navigation.filter(item => {
    if (item.requiredRole && !hasRole(item.requiredRole)) {
      return false
    }
    if (item.resource && !canAccess(item.resource)) {
      return false
    }
    return true
  })

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case 'ADMIN': return 'destructive'
      case 'PIMPINAN': return 'default'
      case 'PETUGAS': return 'secondary'
      case 'USER': return 'outline'
      default: return 'outline'
    }
  }

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case 'ADMIN': return 'Admin'
      case 'PIMPINAN': return 'Pimpinan'
      case 'PETUGAS': return 'Petugas'
      case 'USER': return 'User'
      default: return role
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <img 
              src="https://kp2mi.go.id/assets/dist/img/logo_kp2mi-ntxt.png" 
              alt="Sim-Kendi Logo" 
              className="h-8 w-8"
            />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              Sim-Kendi
            </span>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="https://kp2mi.go.id/assets/dist/img/logo_kp2mi-ntxt.png" 
                alt="Sim-Kendi Logo" 
                className="h-6 w-6"
              />
              <span className="ml-2 text-lg font-semibold text-gray-900">
                Sim-Kendi
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getInitials(user.nama_lengkap)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.nama_lengkap}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="w-fit mt-1">
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-gray-200">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 ${
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden md:fixed md:inset-y-0 md:left-64 md:right-0 md:flex md:flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {filteredNavigation.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {getInitials(user.nama_lengkap)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.nama_lengkap}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {user.jabatan && (
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.jabatan}
                        </p>
                      )}
                      <Badge variant={getRoleBadgeVariant(user.role)} className="w-fit mt-1">
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* Mobile Main Content */}
      <div className="md:hidden">
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  )
}