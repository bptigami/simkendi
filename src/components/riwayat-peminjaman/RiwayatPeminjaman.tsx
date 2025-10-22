"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Car, Calendar, Clock, CheckCircle, AlertCircle, XCircle, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

interface Peminjaman {
  id_peminjaman: number
  user_peminjam?: {
    id_user: number
    nama_lengkap: string
    nip?: string
    jabatan?: string
    instansi?: string
    email: string
  }
  peminjam?: {
    id_peminjam: number
    nama_peminjam: string
    nip: string
    instansi: string
  }
  kendaraan: {
    id_kendaraan: number
    plat_nomor: string
    merek: string
    tipe: string
  }
  tujuan_penggunaan: string
  tujuan_lokasi: string
  tanggal_pinjam: string
  tanggal_kembali_rencana: string
  status: 'Diproses' | 'Disetujui' | 'Ditolak' | 'Selesai'
  catatan_approval?: string
  tanggal_approval?: string
  createdAt: string
  updatedAt: string
}

export default function RiwayatPeminjaman() {
  const { user, token } = useAuth()
  const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPeminjaman, setSelectedPeminjaman] = useState<Peminjaman | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  // Fetch peminjaman data
  const fetchPeminjaman = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/peminjaman/riwayat', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setPeminjamanList(data || [])
      } else {
        toast.error('Gagal memuat data peminjaman')
      }
    } catch (error) {
      console.error('Error fetching peminjaman:', error)
      toast.error('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchPeminjaman()
    }
  }, [token])

  // Filter peminjaman
  const filteredPeminjaman = (peminjamanList || []).filter(peminjaman => {
    const matchesSearch = 
      (peminjaman.user_peminjam?.nama_lengkap || peminjaman.peminjam?.nama_peminjam || 'Tidak diketahui')
        .toLowerCase().includes(searchTerm.toLowerCase()) ||
      peminjaman.kendaraan.plat_nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peminjaman.tujuan_penggunaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peminjaman.tujuan_lokasi.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || peminjaman.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Diproses':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Diproses</Badge>
      case 'Disetujui':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Disetujui</Badge>
      case 'Ditolak':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Ditolak</Badge>
      case 'Selesai':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Selesai</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Riwayat Peminjaman</h1>
          <p className="text-gray-600">
            {user?.role === 'USER' 
              ? 'Monitor riwayat peminjaman kendaraan Anda' 
              : 'Monitor semua peminjaman kendaraan'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari nama, nopol, atau tujuan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Diproses">Diproses</SelectItem>
                  <SelectItem value="Disetujui">Disetujui</SelectItem>
                  <SelectItem value="Ditolak">Ditolak</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peminjaman List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Peminjaman</CardTitle>
          <CardDescription>
            Total {filteredPeminjaman.length} peminjaman ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredPeminjaman.length === 0 ? (
            <div className="text-center py-8">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada peminjaman</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tidak ada peminjaman yang sesuai dengan filter' 
                  : 'Belum ada data peminjaman'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Peminjam</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Tujuan</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPeminjaman.map((peminjaman) => (
                    <TableRow key={peminjaman.id_peminjaman}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {peminjaman.user_peminjam?.nama_lengkap || 
                             peminjaman.peminjam?.nama_peminjam || 
                             'Tidak diketahui'}
                          </div>
                          {peminjaman.user_peminjam?.email && (
                            <div className="text-sm text-gray-500">
                              {peminjaman.user_peminjam.email}
                            </div>
                          )}
                          {(peminjaman.user_peminjam?.nip || peminjaman.peminjam?.nip) && (
                            <div className="text-sm text-gray-500">
                              NIP: {peminjaman.user_peminjam?.nip || peminjaman.peminjam?.nip}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{peminjaman.kendaraan.plat_nomor}</div>
                          <div className="text-sm text-gray-500">
                            {peminjaman.kendaraan.merek} {peminjaman.kendaraan.tipe}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium">{peminjaman.tujuan_penggunaan}</div>
                          <div className="text-sm text-gray-500 truncate">
                            {peminjaman.tujuan_lokasi}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(peminjaman.tanggal_pinjam)}</div>
                          <div className="text-gray-500">s/d</div>
                          <div>{formatDate(peminjaman.tanggal_kembali_rencana)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(peminjaman.status)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPeminjaman(peminjaman)
                            setShowDetailDialog(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {selectedPeminjaman && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${showDetailDialog ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Detail Peminjaman</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailDialog(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Peminjam</label>
                    <p className="mt-1">
                      {selectedPeminjaman.user_peminjam?.nama_lengkap || 
                       selectedPeminjaman.peminjam?.nama_peminjam || 
                       'Tidak diketahui'}
                    </p>
                    {selectedPeminjaman.user_peminjam?.email && (
                      <p className="text-sm text-gray-500">{selectedPeminjaman.user_peminjam.email}</p>
                    )}
                    {(selectedPeminjaman.user_peminjam?.nip || selectedPeminjaman.peminjam?.nip) && (
                      <p className="text-sm text-gray-500">NIP: {selectedPeminjaman.user_peminjam?.nip || selectedPeminjaman.peminjam?.nip}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Kendaraan</label>
                    <p className="mt-1">{selectedPeminjaman.kendaraan.plat_nomor}</p>
                    <p className="text-sm text-gray-500">
                      {selectedPeminjaman.kendaraan.merek} {selectedPeminjaman.kendaraan.tipe}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tujuan Penggunaan</label>
                  <p className="mt-1">{selectedPeminjaman.tujuan_penggunaan}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tujuan Lokasi</label>
                  <p className="mt-1">{selectedPeminjaman.tujuan_lokasi}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tanggal Pinjam</label>
                    <p className="mt-1">{formatDate(selectedPeminjaman.tanggal_pinjam)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tanggal Rencana Kembali</label>
                    <p className="mt-1">{formatDate(selectedPeminjaman.tanggal_kembali_rencana)}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedPeminjaman.status)}
                  </div>
                </div>

                {selectedPeminjaman.catatan_approval && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Catatan Approval</label>
                    <p className="mt-1">{selectedPeminjaman.catatan_approval}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Dibuat</label>
                    <p className="mt-1">{formatDate(selectedPeminjaman.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Diperbarui</label>
                    <p className="mt-1">{formatDate(selectedPeminjaman.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}