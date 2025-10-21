'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Car, 
  User, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Fuel,
  Wrench,
  FileText,
  Download,
  X
} from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useAuth } from '@/contexts/AuthContext'

interface Kendaraan {
  id_kendaraan: number
  plat_nomor: string
  merek: string
  tipe: string
  tahun: number
  status: string
  kondisi_layak: string
  kebersihan: string
  sisa_bensin: number
}

interface UserPeminjam {
  id_user: number
  nama_lengkap: string
  username: string
  nip?: string
  jabatan?: string
  instansi?: string
  email: string
}

interface Peminjaman {
  id_peminjaman: number
  id_kendaraan: number
  id_user_peminjam: number
  tanggal_pinjam: string
  tanggal_kembali_rencana: string
  tujuan_penggunaan: string
  tujuan_lokasi: string
  kondisi_awal_layak: string
  kondisi_awal_kebersihan: string
  kondisi_awal_bensin: number
  status: string
  catatan_approval?: string
  tanggal_approval?: string
  createdAt: string
  updatedAt: string
  // Pernyataan
  pernyataan_keperluan_dinas: boolean
  pernyataan_kebersihan: boolean
  pernyataan_tanggung_jawab: boolean
  // Lampiran
  lampiran_nama?: string
  lampiran_path?: string
  kendaraan: Kendaraan
  user_peminjam: UserPeminjam
}

export default function ApprovalSystem() {
  const { user } = useAuth()
  const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [selectedPeminjaman, setSelectedPeminjaman] = useState<Peminjaman | null>(null)
  const [approvalNotes, setApprovalNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  const [showLampiranPreview, setShowLampiranPreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [previewError, setPreviewError] = useState('')

  useEffect(() => {
    fetchPeminjaman()
  }, [])

  const fetchPeminjaman = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/peminjaman', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        // Filter yang menunggu approval
        const waitingApproval = data.filter((p: Peminjaman) => p.status === 'Diproses')
        setPeminjamanList(waitingApproval)
      } else {
        setError('Gagal mengambil data peminjaman')
      }
    } catch (error) {
      setError('Terjadi kesalahan saat mengambil data')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (approved: boolean) => {
    if (!selectedPeminjaman) return

    setProcessing(true)
    setError('')
    setMessage('')

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/peminjaman/${selectedPeminjaman.id_peminjaman}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approved,
          catatan: approvalNotes
        })
      })

      if (response.ok) {
        setMessage(approved ? 'Peminjaman disetujui!' : 'Peminjaman ditolak!')
        setSelectedPeminjaman(null)
        setApprovalNotes('')
        fetchPeminjaman() // Refresh data
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Gagal memproses approval')
      }
    } catch (error) {
      setError('Terjadi kesalahan saat memproses approval')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Diproses':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Menunggu Approval</Badge>
      case 'Disetujui':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Disetujui</Badge>
      case 'Ditolak':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Ditolak</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handlePreviewLampiran = (lampiranPath: string, lampiranNama: string) => {
    setPreviewError('')
    try {
      // Construct full URL for the lampiran
      const fullUrl = lampiranPath.startsWith('http') 
        ? lampiranPath 
        : `${window.location.origin}${lampiranPath}`
      
      setPreviewUrl(fullUrl)
      setShowLampiranPreview(true)
    } catch (error) {
      setPreviewError('Gagal memuat preview lampiran')
      console.error('Preview error:', error)
    }
  }

  const closeLampiranPreview = () => {
    setShowLampiranPreview(false)
    setPreviewUrl('')
    setPreviewError('')
  }

  const downloadLampiran = (lampiranPath: string, lampiranNama: string) => {
    try {
      const fullUrl = lampiranPath.startsWith('http') 
        ? lampiranPath 
        : `${window.location.origin}${lampiranPath}`
      
      const link = document.createElement('a')
      link.href = fullUrl
      link.download = lampiranNama
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName?.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileText className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Memuat data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approval Peminjaman</h1>
          <p className="text-muted-foreground">
            Review dan persetujuan pengajuan peminjaman kendaraan
          </p>
        </div>
      </div>

      {message && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            {message}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daftar Peminjaman Menunggu Approval */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Menunggu Approval ({peminjamanList.length})
            </CardTitle>
            <CardDescription>
              Daftar pengajuan peminjaman yang perlu disetujui
            </CardDescription>
          </CardHeader>
          <CardContent>
            {peminjamanList.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Tidak ada peminjaman menunggu approval</p>
              </div>
            ) : (
              <div className="space-y-3">
                {peminjamanList.map((peminjaman) => (
                  <div
                    key={peminjaman.id_peminjaman}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPeminjaman?.id_peminjaman === peminjaman.id_peminjaman
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPeminjaman(peminjaman)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Car className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {peminjaman.kendaraan.plat_nomor} - {peminjaman.kendaraan.merek} {peminjaman.kendaraan.tipe}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <User className="h-3 w-3" />
                          <span>{peminjaman.user_peminjam.username}</span>
                          {peminjaman.user_peminjam.nip && (
                            <span>({peminjaman.user_peminjam.nip})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(new Date(peminjaman.tanggal_pinjam), 'dd MMM yyyy', { locale: id })} -{' '}
                            {format(new Date(peminjaman.tanggal_kembali_rencana), 'dd MMM yyyy', { locale: id })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(peminjaman.status)}
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Detail
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Peminjaman */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detail Peminjaman
            </CardTitle>
            <CardDescription>
              Informasi lengkap pengajuan peminjaman
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPeminjaman ? (
              <div className="space-y-4">
                {/* Informasi Peminjam */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informasi Peminjam
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                    <p className="text-sm"><strong>Username:</strong> {selectedPeminjaman.user_peminjam.username}</p>
                    <p className="text-sm"><strong>Nama:</strong> {selectedPeminjaman.user_peminjam.nama_lengkap}</p>
                    {selectedPeminjaman.user_peminjam.nip && (
                      <p className="text-sm"><strong>NIP:</strong> {selectedPeminjaman.user_peminjam.nip}</p>
                    )}
                    {selectedPeminjaman.user_peminjam.jabatan && (
                      <p className="text-sm"><strong>Jabatan:</strong> {selectedPeminjaman.user_peminjam.jabatan}</p>
                    )}
                    {selectedPeminjaman.user_peminjam.instansi && (
                      <p className="text-sm"><strong>Instansi:</strong> {selectedPeminjaman.user_peminjam.instansi}</p>
                    )}
                  </div>
                </div>

                {/* Informasi Kendaraan */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Informasi Kendaraan
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                    <p className="text-sm"><strong>Plat Nomor:</strong> {selectedPeminjaman.kendaraan.plat_nomor}</p>
                    <p className="text-sm"><strong>Kendaraan:</strong> {selectedPeminjaman.kendaraan.merek} {selectedPeminjaman.kendaraan.tipe} ({selectedPeminjaman.kendaraan.tahun})</p>
                    <p className="text-sm"><strong>Kondisi:</strong> {selectedPeminjaman.kendaraan.kondisi_layak}</p>
                    <p className="text-sm"><strong>Kebersihan:</strong> {selectedPeminjaman.kendaraan.kebersihan}</p>
                    <p className="text-sm"><strong>Bahan Bakar:</strong> {selectedPeminjaman.kendaraan.sisa_bensin} L</p>
                  </div>
                </div>

                {/* Informasi Peminjaman */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Informasi Peminjaman
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                    <p className="text-sm"><strong>Tanggal Pinjam:</strong> {format(new Date(selectedPeminjaman.tanggal_pinjam), 'dd MMMM yyyy', { locale: id })}</p>
                    <p className="text-sm"><strong>Tanggal Rencana Kembali:</strong> {format(new Date(selectedPeminjaman.tanggal_kembali_rencana), 'dd MMMM yyyy', { locale: id })}</p>
                    <p className="text-sm"><strong>Tujuan Penggunaan:</strong> {selectedPeminjaman.tujuan_penggunaan}</p>
                    <p className="text-sm"><strong>Tujuan Lokasi:</strong> {selectedPeminjaman.tujuan_lokasi}</p>
                  </div>
                </div>

                {/* Lampiran Pendukung */}
                {selectedPeminjaman.lampiran_nama && selectedPeminjaman.lampiran_path && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Lampiran Pendukung
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFileIcon(selectedPeminjaman.lampiran_nama)}
                          <span className="text-sm font-medium">{selectedPeminjaman.lampiran_nama}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreviewLampiran(selectedPeminjaman.lampiran_path!, selectedPeminjaman.lampiran_nama!)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadLampiran(selectedPeminjaman.lampiran_path!, selectedPeminjaman.lampiran_nama!)}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pernyataan Peminjam */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Pernyataan Peminjam
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 ${selectedPeminjaman.pernyataan_keperluan_dinas ? 'bg-green-500 border-green-500' : 'bg-gray-200 border-gray-300'}`}>
                        {selectedPeminjaman.pernyataan_keperluan_dinas && (
                          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm">Saya menyatakan bahwa kendaraan ini hanya akan digunakan untuk keperluan dinas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 ${selectedPeminjaman.pernyataan_kebersihan ? 'bg-green-500 border-green-500' : 'bg-gray-200 border-gray-300'}`}>
                        {selectedPeminjaman.pernyataan_kebersihan && (
                          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm">Saya berjanji akan menjaga kebersihan kendaraan selama pemakaian</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 ${selectedPeminjaman.pernyataan_tanggung_jawab ? 'bg-green-500 border-green-500' : 'bg-gray-200 border-gray-300'}`}>
                        {selectedPeminjaman.pernyataan_tanggung_jawab && (
                          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm">Saya bertanggung jawab atas segala kerusakan yang terjadi selama pemakaian</span>
                    </div>
                  </div>
                </div>

                {/* Catatan Approval */}
                <div>
                  <Label htmlFor="catatan">Catatan Approval</Label>
                  <Textarea
                    id="catatan"
                    placeholder="Tambahkan catatan untuk persetujuan atau penolakan..."
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Tombol Approval */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleApprove(true)}
                    disabled={processing}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {processing ? 'Memproses...' : 'Setujui'}
                  </Button>
                  <Button
                    onClick={() => handleApprove(false)}
                    disabled={processing}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {processing ? 'Memproses...' : 'Tolak'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Pilih peminjaman untuk melihat detail</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lampiran Preview Modal */}
      {showLampiranPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Preview Lampiran</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeLampiranPreview}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              {previewError ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-red-600">{previewError}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => downloadLampiran(previewUrl, selectedPeminjaman?.lampiran_nama || 'lampiran')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {previewUrl.toLowerCase().includes('.pdf') ? (
                    <iframe
                      src={previewUrl}
                      className="w-full h-[600px] border rounded"
                      title="PDF Preview"
                    />
                  ) : previewUrl.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <div className="text-center">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full max-h-[600px] mx-auto rounded border"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-4">
                        Preview tidak tersedia untuk jenis file ini. Silakan download file untuk melihat isinya.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => downloadLampiran(previewUrl, selectedPeminjaman?.lampiran_nama || 'lampiran')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download File
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}