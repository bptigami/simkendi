'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, Clock, User, Car, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PeminjamanWithDetails {
  id_peminjaman: number
  id_kendaraan: number
  id_user_peminjam?: number
  id_peminjam?: number
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
  kendaraan: {
    id_kendaraan: number
    plat_nomor: string
    merek: string
    tipe: string
    tahun: number
    kondisi_layak: string
    kebersihan: string
    sisa_bensin: number
    status: string
  }
  user_peminjam?: {
    id_user: number
    username: string
    email: string
    nama_lengkap: string
    nip?: string
    jabatan?: string
    instansi?: string
  }
  peminjam?: {
    id_peminjam: number
    nama_peminjam: string
    nip: string
    jabatan?: string
    instansi: string
    kontak: string
  }
  creator?: {
    id_user: number
    username: string
    nama_lengkap: string
  }
  approver?: {
    id_user: number
    username: string
    nama_lengkap: string
  }
  pengembalian?: {
    id_pengembalian: number
    tanggal_kembali: string
    kondisi_akhir_layak: string
    kondisi_akhir_kebersihan: string
    kondisi_akhir_bensin: number
    catatan_petugas?: string
    id_petugas?: number
    createdAt: string
  }
}

export default function PengembalianSystem() {
  const [peminjamanList, setPeminjamanList] = useState<PeminjamanWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeminjaman, setSelectedPeminjaman] = useState<PeminjamanWithDetails | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('dikembalikan')
  const { toast } = useToast()

  // Form states
  const [kondisiAkhirLayak, setKondisiAkhirLayak] = useState('')
  const [kondisiAkhirKebersihan, setKondisiAkhirKebersihan] = useState('')
  const [kondisiAkhirBensin, setKondisiAkhirBensin] = useState('')
  const [catatanPetugas, setCatatanPetugas] = useState('')

  useEffect(() => {
    fetchPeminjaman()
  }, [])

  const fetchPeminjaman = async () => {
    try {
      const response = await fetch('/api/peminjaman')
      if (!response.ok) throw new Error('Gagal mengambil data peminjaman')
      
      const data = await response.json()
      setPeminjamanList(data)
    } catch (error) {
      console.error('Error fetching peminjaman:', error)
      toast({
        title: "Error",
        description: "Gagal mengambil data peminjaman",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProsesPengembalian = async () => {
    if (!selectedPeminjaman || !kondisiAkhirLayak || !kondisiAkhirKebersihan || !kondisiAkhirBensin) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch(`/api/peminjaman/${selectedPeminjaman.id_peminjaman}/kembalikan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kondisi_akhir_layak: kondisiAkhirLayak,
          kondisi_akhir_kebersihan: kondisiAkhirKebersihan,
          kondisi_akhir_bensin: parseFloat(kondisiAkhirBensin),
          catatan_petugas: catatanPetugas,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Gagal memproses pengembalian')
      }

      toast({
        title: "Berhasil",
        description: "Pengembalian berhasil diproses",
      })

      // Reset form
      setSelectedPeminjaman(null)
      setKondisiAkhirLayak('')
      setKondisiAkhirKebersihan('')
      setKondisiAkhirBensin('')
      setCatatanPetugas('')
      
      // Refresh data
      fetchPeminjaman()
    } catch (error: any) {
      console.error('Error processing pengembalian:', error)
      toast({
        title: "Error",
        description: error.message || "Gagal memproses pengembalian",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Disetujui':
        return <Badge className="bg-blue-100 text-blue-800">Disetujui</Badge>
      case 'Selesai':
        return <Badge className="bg-green-100 text-green-800">Selesai</Badge>
      case 'Diproses':
        return <Badge className="bg-yellow-100 text-yellow-800">Diproses</Badge>
      case 'Ditolak':
        return <Badge className="bg-red-100 text-red-800">Ditolak</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const getKondisiBadge = (kondisi: string) => {
    switch (kondisi) {
      case 'Layak':
        return <Badge className="bg-green-100 text-green-800">Layak</Badge>
      case 'Tidak Layak':
        return <Badge className="bg-red-100 text-red-800">Tidak Layak</Badge>
      case 'Bersih':
        return <Badge className="bg-green-100 text-green-800">Bersih</Badge>
      case 'Perlu Dibersihkan':
        return <Badge className="bg-yellow-100 text-yellow-800">Perlu Dibersihkan</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{kondisi}</Badge>
    }
  }

  const filteredPeminjaman = peminjamanList.filter(p => {
    if (activeTab === 'menunggu') {
      return p.status === 'Disetujui' && !p.pengembalian
    } else if (activeTab === 'dikembalikan') {
      return p.pengembalian !== null
    }
    return false
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sistem Pengembalian Kendaraan</h1>
        <p className="text-gray-600">Kelola pengembalian kendaraan yang telah dipinjam</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="menunggu">Menunggu Pengembalian</TabsTrigger>
          <TabsTrigger value="dikembalikan">Sudah Dikembalikan</TabsTrigger>
        </TabsList>

        <TabsContent value="menunggu" className="space-y-4">
          <div className="grid gap-4">
            {filteredPeminjaman.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Tidak ada kendaraan yang menunggu pengembalian
                </AlertDescription>
              </Alert>
            ) : (
              filteredPeminjaman.map((peminjaman) => (
                <Card key={peminjaman.id_peminjaman} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {peminjaman.kendaraan.plat_nomor} - {peminjaman.kendaraan.merek} {peminjaman.kendaraan.tipe}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusBadge(peminjaman.status)}
                          <Badge variant="outline">{peminjaman.kendaraan.status}</Badge>
                        </div>
                      </div>
                      <Button
                        onClick={() => setSelectedPeminjaman(peminjaman)}
                        disabled={selectedPeminjaman?.id_peminjaman === peminjaman.id_peminjaman}
                      >
                        Proses Pengembalian
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Peminjam:</span>
                          <span className="text-sm">
                            {peminjaman.user_peminjam?.nama_lengkap || peminjaman.peminjam?.nama_peminjam || '-'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Tanggal Pinjam:</span>
                          <span className="text-sm">{peminjaman.tanggal_pinjam}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Rencana Kembali:</span>
                          <span className="text-sm">{peminjaman.tanggal_kembali_rencana}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Kondisi Awal:</span>
                          <div className="flex gap-1">
                            {getKondisiBadge(peminjaman.kondisi_awal_layak)}
                            {getKondisiBadge(peminjaman.kondisi_awal_kebersihan)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Bensin Awal:</span>
                          <span className="text-sm">{peminjaman.kondisi_awal_bensin} L</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Tujuan:</span>
                          <span className="text-sm">{peminjaman.tujuan_penggunaan}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="dikembalikan" className="space-y-4">
          <div className="grid gap-4">
            {filteredPeminjaman.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Belum ada kendaraan yang dikembalikan
                </AlertDescription>
              </Alert>
            ) : (
              filteredPeminjaman.map((peminjaman) => (
                <Card key={peminjaman.id_peminjaman}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {peminjaman.kendaraan.plat_nomor} - {peminjaman.kendaraan.merek} {peminjaman.kendaraan.tipe}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusBadge(peminjaman.status)}
                          <Badge className="bg-green-100 text-green-800">Sudah Dikembalikan</Badge>
                        </div>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Peminjam:</span>
                          <span className="text-sm">
                            {peminjaman.user_peminjam?.nama_lengkap || peminjaman.peminjam?.nama_peminjam || '-'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Tanggal Kembali:</span>
                          <span className="text-sm">{peminjaman.pengembalian?.tanggal_kembali}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Kondisi Akhir:</span>
                          <div className="flex gap-1">
                            {getKondisiBadge(peminjaman.pengembalian?.kondisi_akhir_layak || '')}
                            {getKondisiBadge(peminjaman.pengembalian?.kondisi_akhir_kebersihan || '')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Bensin Akhir:</span>
                          <span className="text-sm">{peminjaman.pengembalian?.kondisi_akhir_bensin} L</span>
                        </div>
                      </div>
                    </div>
                    {peminjaman.pengembalian?.catatan_petugas && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Catatan Petugas:</p>
                        <p className="text-sm text-gray-600">{peminjaman.pengembalian.catatan_petugas}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Form Pengembalian */}
      {selectedPeminjaman && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Proses Pengembalian Kendaraan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="kendaraan">Kendaraan</Label>
                <Input
                  id="kendaraan"
                  value={`${selectedPeminjaman.kendaraan.plat_nomor} - ${selectedPeminjaman.kendaraan.merek} ${selectedPeminjaman.kendaraan.tipe}`}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="peminjam">Peminjam</Label>
                <Input
                  id="peminjam"
                  value={selectedPeminjaman.user_peminjam?.nama_lengkap || selectedPeminjaman.peminjam?.nama_peminjam || '-'}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="kondisi_layak">Kondisi Layak</Label>
                <Select value={kondisiAkhirLayak} onValueChange={setKondisiAkhirLayak}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kondisi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Layak">Layak</SelectItem>
                    <SelectItem value="Tidak Layak">Tidak Layak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="kondisi_kebersihan">Kondisi Kebersihan</Label>
                <Select value={kondisiAkhirKebersihan} onValueChange={setKondisiAkhirKebersihan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kondisi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bersih">Bersih</SelectItem>
                    <SelectItem value="Perlu Dibersihkan">Perlu Dibersihkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sisa_bensin">Sisa Bensin (Liter)</Label>
                <Input
                  id="sisa_bensin"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={kondisiAkhirBensin}
                  onChange={(e) => setKondisiAkhirBensin(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="catatan">Catatan Petugas (Opsional)</Label>
              <Textarea
                id="catatan"
                placeholder="Masukkan catatan tambahan..."
                value={catatanPetugas}
                onChange={(e) => setCatatanPetugas(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleProsesPengembalian}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Proses Pengembalian
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPeminjaman(null)
                  setKondisiAkhirLayak('')
                  setKondisiAkhirKebersihan('')
                  setKondisiAkhirBensin('')
                  setCatatanPetugas('')
                }}
              >
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}