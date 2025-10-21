'use client'

import { useState, useEffect } from 'react'
import { Car, Users, Calendar, FileText, BarChart3, TrendingUp, MapPin, Wrench, Building, Clock, CheckCircle, AlertCircle, UserCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'

interface DashboardStats {
  totalKendaraan: number
  kendaraanTersedia: number
  kendaraanDipinjam: number
  kendaraanPerawatan: number
  persentaseLayak: number
  peminjamanBulanIni: number
  peminjamanHariIni: Array<{
    id_peminjaman: number
    kendaraan: {
      plat_nomor: string
      merek: string
      tipe: string
    }
    peminjam: {
      nama_lengkap: string
    }
    status: string
  }>
  lokasiStats: Array<{
    tujuan_lokasi: string
    _count: { tujuan_lokasi: number }
  }>
  divisiStats: Array<{
    tujuan_penggunaan: string
    _count: { tujuan_penggunaan: number }
  }>
  kendaraanPopuler: Array<{
    id_kendaraan: number
    plat_nomor: string
    merek: string
    tipe: string
    count: number
  }>
  // New peminjam statistics
  totalPeminjam: number
  peminjamAktifBulanIni: number
  instansiStats: Array<{
    instansi: string
    _count: { instansi: number }
  }>
  peminjamTeraktif: Array<{
    id_peminjam: number
    nama_lengkap: string
    nip: string
    instansi: string
    email: string
    count: number
  }>
  // User specific stats
  userPeminjaman?: Array<{
    id_peminjaman: number
    kendaraan: {
      plat_nomor: string
      merek: string
      tipe: string
    }
    tanggal_pinjam: string
    tanggal_kembali_rencana: string
    status: string
  }>
  pendingApprovals?: number
}

export default function DashboardStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disetujui': return 'bg-green-100 text-green-800'
      case 'Ditolak': return 'bg-red-100 text-red-800'
      case 'Diproses': return 'bg-yellow-100 text-yellow-800'
      case 'Selesai': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Memuat data dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Gagal memuat data dashboard</p>
      </div>
    )
  }

  // Dashboard untuk USER (peminjam biasa)
  if (user?.role === 'USER') {
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Selamat Datang, {user.nama_lengkap}!</h2>
          <p className="text-blue-100">Dashboard peminjaman kendaraan untuk Anda</p>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Peminjaman Aktif</CardTitle>
              <Car className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.userPeminjaman?.filter(p => p.status === 'Disetujui').length || 0}
              </div>
              <p className="text-xs text-gray-500">Sedang digunakan</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Menunggu Persetujuan</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.userPeminjaman?.filter(p => p.status === 'Diproses').length || 0}
              </div>
              <p className="text-xs text-gray-500">Sedang diproses</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Peminjaman</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.userPeminjaman?.length || 0}
              </div>
              <p className="text-xs text-gray-500">Semua waktu</p>
            </CardContent>
          </Card>
        </div>

        {/* User Peminjaman History */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Riwayat Peminjaman Anda</CardTitle>
            <CardDescription>Daftar peminjaman kendaraan yang telah Anda ajukan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {stats.userPeminjaman && stats.userPeminjaman.length > 0 ? (
                stats.userPeminjaman.map((peminjaman) => (
                  <div key={peminjaman.id_peminjaman} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Car className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {peminjaman.kendaraan.plat_nomor} - {peminjaman.kendaraan.merek} {peminjaman.kendaraan.tipe}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(peminjaman.tanggal_pinjam).toLocaleDateString('id-ID')} - {new Date(peminjaman.tanggal_kembali_rencana).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(peminjaman.status)}>
                      {peminjaman.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Belum ada riwayat peminjaman</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Available Vehicles */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Kendaraan Tersedia</CardTitle>
            <CardDescription>Kendaraan yang dapat Anda pinjam saat ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Kendaraan Tersedia</p>
                  <p className="text-xs text-gray-500">{stats.kendaraanTersedia} unit siap digunakan</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Car className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Kelayakan</p>
                  <p className="text-xs text-gray-500">{stats.persentaseLayak}% kendaraan layak jalan</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Dashboard untuk PIMPINAN
  if (user?.role === 'PIMPINAN') {
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Dashboard Pimpinan</h2>
          <p className="text-purple-100">Monitor dan kelola persetujuan peminjaman kendaraan</p>
        </div>

        {/* Approval Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Menunggu Persetujuan</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals || 0}</div>
              <p className="text-xs text-gray-500">Perlu persetujuan Anda</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Disetujui Bulan Ini</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.peminjamanBulanIni}</div>
              <p className="text-xs text-gray-500">Total persetujuan</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Kendaraan Aktif</CardTitle>
              <Car className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.kendaraanDipinjam}</div>
              <p className="text-xs text-gray-500">Sedang digunakan</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tingkat Utilisasi</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalKendaraan > 0 ? Math.round((stats.kendaraanDipinjam / stats.totalKendaraan) * 100) : 0}%
              </div>
              <p className="text-xs text-gray-500">Dari total kendaraan</p>
            </CardContent>
          </Card>
        </div>

        {/* Approval Queue */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Antrian Persetujuan</CardTitle>
            <CardDescription>Peminjaman yang menunggu persetujuan Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {stats.peminjamanHariIni.filter(p => p.status === 'Diproses').length > 0 ? (
                stats.peminjamanHariIni.filter(p => p.status === 'Diproses').map((peminjaman) => (
                  <div key={peminjaman.id_peminjaman} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {peminjaman.kendaraan.plat_nomor} - {peminjaman.kendaraan.merek} {peminjaman.kendaraan.tipe}
                        </p>
                        <p className="text-xs text-gray-500">
                        Dipinjam oleh: {peminjaman.peminjam?.nama_lengkap || 
                                       'Tidak diketahui'}
                      </p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Menunggu Persetujuan
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Tidak ada peminjaman yang menunggu persetujuan</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Usage Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Lokasi Tujuan Populer</CardTitle>
              <CardDescription>Lokasi yang paling sering dikunjungi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stats.lokasiStats.length > 0 ? (
                  stats.lokasiStats.slice(0, 5).map((lokasi) => (
                    <div key={`lokasi-${lokasi.tujuan_lokasi}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{lokasi.tujuan_lokasi}</span>
                      </div>
                      <Badge variant="secondary">{lokasi._count.tujuan_lokasi} kali</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Belum ada data lokasi</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Divisi Teraktif</CardTitle>
              <CardDescription>Divisi dengan penggunaan kendaraan terbanyak</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stats.divisiStats.length > 0 ? (
                  stats.divisiStats.slice(0, 5).map((divisi) => (
                    <div key={`divisi-${divisi.tujuan_penggunaan}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{divisi.tujuan_penggunaan}</span>
                      </div>
                      <Badge variant="secondary">{divisi._count.tujuan_penggunaan} kali</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Building className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Belum ada data divisi</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Dashboard untuk PETUGAS
  if (user?.role === 'PETUGAS') {
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Dashboard Petugas</h2>
          <p className="text-green-100">Kelola operasional kendaraan dan peminjaman</p>
        </div>

        {/* Operational Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Kendaraan Tersedia</CardTitle>
              <Car className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.kendaraanTersedia}</div>
              <p className="text-xs text-gray-500">Siap digunakan</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sedang Dipinjam</CardTitle>
              <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.kendaraanDipinjam}</div>
              <p className="text-xs text-gray-500">Dalam peminjaman</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Perawatan</CardTitle>
              <Wrench className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.kendaraanPerawatan}</div>
              <p className="text-xs text-gray-500">Dalam perawatan</p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Peminjaman Hari Ini</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.peminjamanHariIni.length}</div>
              <p className="text-xs text-gray-500">Total transaksi</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Jadwal Hari Ini</CardTitle>
            <CardDescription>Semua peminjaman kendaraan untuk hari ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {stats.peminjamanHariIni.length > 0 ? (
                stats.peminjamanHariIni.map((peminjaman) => (
                  <div key={peminjaman.id_peminjaman} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Car className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {peminjaman.kendaraan.plat_nomor} - {peminjaman.kendaraan.merek} {peminjaman.kendaraan.tipe}
                        </p>
                        <p className="text-xs text-gray-500">
                        Dipinjam oleh: {peminjaman.peminjam?.nama_lengkap || 
                                       'Tidak diketahui'}
                      </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(peminjaman.status)}>
                      {peminjaman.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Tidak ada peminjaman hari ini</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Status Kendaraan</CardTitle>
              <CardDescription>Ringkasan kondisi kendaraan saat ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Kendaraan</span>
                  <span className="text-sm font-medium text-gray-900">{stats.totalKendaraan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Kendaraan Layak</span>
                  <span className="text-sm font-medium text-green-600">{stats.persentaseLayak}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tingkat Ketersediaan</span>
                  <span className="text-sm font-medium text-blue-600">
                    {stats.totalKendaraan > 0 ? Math.round((stats.kendaraanTersedia / stats.totalKendaraan) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Utilisasi Aktif</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {stats.totalKendaraan > 0 ? Math.round((stats.kendaraanDipinjam / stats.totalKendaraan) * 100) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Kendaraan Populer</CardTitle>
              <CardDescription>Kendaraan yang paling sering dipinjam</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stats.kendaraanPopuler.length > 0 ? (
                  stats.kendaraanPopuler.slice(0, 5).map((kendaraan) => (
                    <div key={kendaraan.id_kendaraan} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {kendaraan.plat_nomor} - {kendaraan.merek} {kendaraan.tipe}
                        </span>
                      </div>
                      <Badge variant="secondary">{kendaraan.count} kali</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Car className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Belum ada data penggunaan</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Dashboard untuk ADMIN (original comprehensive dashboard)
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Dashboard Administrator</h2>
        <p className="text-indigo-100">Monitor lengkap sistem manajemen kendaraan</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Kendaraan</CardTitle>
            <Car className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalKendaraan}</div>
            <p className="text-xs text-gray-500">Kendaraan terdaftar</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tersedia</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.kendaraanTersedia}</div>
            <p className="text-xs text-gray-500">
              {stats.totalKendaraan > 0 ? Math.round((stats.kendaraanTersedia / stats.totalKendaraan) * 100) : 0}% dari total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Dipinjam</CardTitle>
            <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.kendaraanDipinjam}</div>
            <p className="text-xs text-gray-500">
              {stats.totalKendaraan > 0 ? Math.round((stats.kendaraanDipinjam / stats.totalKendaraan) * 100) : 0}% dari total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Dalam Perawatan</CardTitle>
            <div className="h-4 w-4 bg-red-500 rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.kendaraanPerawatan}</div>
            <p className="text-xs text-gray-500">
              {stats.totalKendaraan > 0 ? Math.round((stats.kendaraanPerawatan / stats.totalKendaraan) * 100) : 0}% dari total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Kelayakan Kendaraan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.persentaseLayak}%</div>
            <p className="text-xs text-gray-500">Kendaraan layak jalan</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Peminjaman Bulan Ini</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.peminjamanBulanIni}</div>
            <p className="text-xs text-gray-500">Total transaksi</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Peminjam</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalPeminjam}</div>
            <p className="text-xs text-gray-500">Terdaftar dalam sistem</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Peminjam Aktif</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.peminjamAktifBulanIni}</div>
            <p className="text-xs text-gray-500">Bulan ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Peminjam Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Instansi Terbanyak</CardTitle>
            <CardDescription>5 instansi dengan peminjam terbanyak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.instansiStats.length > 0 ? (
                stats.instansiStats.map((instansi) => (
                  <div key={`instansi-${instansi.instansi}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{instansi.instansi}</span>
                    </div>
                    <Badge variant="secondary">{instansi._count.instansi} peminjam</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Building className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Belum ada data instansi</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Peminjam Teraktif</CardTitle>
            <CardDescription>5 peminjam dengan transaksi terbanyak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.peminjamTeraktif.length > 0 ? (
                stats.peminjamTeraktif.map((peminjam) => (
                  <div key={peminjam.id_peminjam} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{peminjam.nama_lengkap}</span>
                        <p className="text-xs text-gray-500">{peminjam.instansi}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{peminjam.count} kali</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Belum ada data peminjaman</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Peminjaman Hari Ini</CardTitle>
            <CardDescription>Daftar peminjaman kendaraan untuk hari ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {stats.peminjamanHariIni.length > 0 ? (
                stats.peminjamanHariIni.map((peminjaman) => (
                  <div key={peminjaman.id_peminjaman} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Car className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {peminjaman.kendaraan.plat_nomor} - {peminjaman.kendaraan.merek} {peminjaman.kendaraan.tipe}
                        </p>
                        <p className="text-xs text-gray-500">
                        Dipinjam oleh: {peminjaman.peminjam?.nama_lengkap || 
                                       'Tidak diketahui'}
                      </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(peminjaman.status)}>
                      {peminjaman.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Tidak ada peminjaman hari ini</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Lokasi Tujuan Populer</CardTitle>
            <CardDescription>10 lokasi tujuan terpopuler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.lokasiStats.length > 0 ? (
                stats.lokasiStats.map((lokasi) => (
                  <div key={`lokasi-popular-${lokasi.tujuan_lokasi}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{lokasi.tujuan_lokasi}</span>
                    </div>
                    <Badge variant="secondary">{lokasi._count.tujuan_lokasi} kali</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Belum ada data lokasi</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Vehicles and Usage Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Kendaraan Populer</CardTitle>
            <CardDescription>Kendaraan yang paling sering dipinjam</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.kendaraanPopuler.length > 0 ? (
                stats.kendaraanPopuler.map((kendaraan) => (
                  <div key={kendaraan.id_kendaraan} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {kendaraan.plat_nomor} - {kendaraan.merek} {kendaraan.tipe}
                      </span>
                    </div>
                    <Badge variant="secondary">{kendaraan.count} kali</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Car className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Belum ada data penggunaan</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Statistik Penggunaan</CardTitle>
            <CardDescription>Ringkasan penggunaan kendaraan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Peminjaman Bulan Ini</span>
                <span className="text-sm font-medium text-gray-900">{stats.peminjamanBulanIni}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rata-rata Peminjaman/Hari</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(stats.peminjamanBulanIni / 30 * 10) / 10}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tingkat Ketersediaan</span>
                <span className="text-sm font-medium text-green-600">
                  {stats.totalKendaraan > 0 ? Math.round((stats.kendaraanTersedia / stats.totalKendaraan) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tingkat Utilisasi</span>
                <span className="text-sm font-medium text-blue-600">
                  {stats.totalKendaraan > 0 ? Math.round((stats.kendaraanDipinjam / stats.totalKendaraan) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Kendaraan Layak Jalan</span>
                <span className="text-sm font-medium text-green-600">{stats.persentaseLayak}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}