'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navigation } from '@/components/layout/Navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Lock, Key, CheckCircle, AlertCircle, User, Shield, Settings as SettingsIcon } from 'lucide-react'

type SettingsSection = 'profile' | 'security'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile')
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
 })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null
    text: string
  }>({ type: null, text: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const validateForm = () => {
    if (!formData.currentPassword) {
      setMessage({ type: 'error', text: 'Password lama harus diisi' })
      return false
    }
    if (!formData.newPassword) {
      setMessage({ type: 'error', text: 'Password baru harus diisi' })
      return false
    }
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password baru minimal 6 karakter' })
      return false
    }
    if (!formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi password harus diisi' })
      return false
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru dan konfirmasi tidak cocok' })
      return false
    }
    if (formData.currentPassword === formData.newPassword) {
      setMessage({ type: 'error', text: 'Password baru tidak boleh sama dengan password lama' })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage({ type: null, text: '' })

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          userId: user.id_user
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password berhasil diubah!' })
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal mengubah password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan. Silakan coba lagi.' })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute>
      <Navigation>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pengaturan</h2>
            <p className="text-gray-600">Kelola pengaturan akun Anda</p>
          </div>

          {/* Navigation Tabs */}
          <Card className="bg-white">
            <CardContent className="p-0">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveSection('profile')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeSection === 'profile'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Informasi Profil
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveSection('security')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeSection === 'security'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Keamanan
                    </div>
                  </button>
                </nav>
              </div>
            </CardContent>
          </Card>

          {/* Content based on active section */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              {/* User Info Card */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informasi Akun
                  </CardTitle>
                  <CardDescription>Informasi akun Anda yang sedang login</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Nama Lengkap</Label>
                        <p className="mt-1 text-sm text-gray-900">{user.nama_lengkap}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                        <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Username</Label>
                        <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {user.nip && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">NIP</Label>
                          <p className="mt-1 text-sm text-gray-900">{user.nip}</p>
                        </div>
                      )}
                      {user.jabatan && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Jabatan</Label>
                          <p className="mt-1 text-sm text-gray-900">{user.jabatan}</p>
                        </div>
                      )}
                      {user.instansi && (
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Instansi</Label>
                          <p className="mt-1 text-sm text-gray-900">{user.instansi}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Role</Label>
                        <p className="mt-1 text-sm text-gray-900">{user.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Status Card */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">Status Akun</CardTitle>
                  <CardDescription>Status aktivitas akun Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Status Aktif</Label>
                      <p className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Terakhir Login</Label>
                      <p className="mt-1 text-sm text-gray-900">
                        {user.last_login 
                          ? new Date(user.last_login).toLocaleString('id-ID')
                          : 'Belum pernah login'
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Dibuat Sejak</Label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Terakhir Diupdate</Label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(user.updatedAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              {/* Change Password Card */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    Ubah Password
                  </CardTitle>
                  <CardDescription>
                    Ubah password akun Anda untuk keamanan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <Label htmlFor="currentPassword">Password Lama</Label>
                      <div className="relative mt-1">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPasswords.current ? 'text' : 'password'}
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Masukkan password lama"
                          className="pr-10"
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('current')}
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <Label htmlFor="newPassword">Password Baru</Label>
                      <div className="relative mt-1">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showPasswords.new ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Masukkan password baru (minimal 6 karakter)"
                          className="pr-10"
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('new')}
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                      <div className="relative mt-1">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Masukkan kembali password baru"
                          className="pr-10"
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('confirm')}
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Message */}
                    {message.type && (
                      <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                        <div className="flex items-center">
                          {message.type === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                          )}
                          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                            {message.text}
                          </AlertDescription>
                        </div>
                      </Alert>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {loading ? (
                          <>
                            <Lock className="h-4 w-4 mr-2 animate-spin" />
                            Memproses...
                          </>
                        ) : (
                          <>
                            <Key className="h-4 w-4 mr-2" />
                            Ubah Password
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Security Tips Card */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Tips Keamanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">1</div>
                      </div>
                      <p className="ml-3 text-sm text-blue-800">Gunakan password yang kuat dan unik</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">2</div>
                      </div>
                      <p className="ml-3 text-sm text-blue-800">Jangan berbagi password dengan orang lain</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">3</div>
                      </div>
                      <p className="ml-3 text-sm text-blue-800">Ganti password secara berkala</p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">4</div>
                      </div>
                      <p className="ml-3 text-sm text-blue-800">Logout setelah selesai menggunakan sistem</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </Navigation>
    </ProtectedRoute>
  )
}