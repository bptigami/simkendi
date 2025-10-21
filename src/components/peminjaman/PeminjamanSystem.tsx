'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarIcon, Car, Clock, Fuel, User, MapPin, Upload, FileText } from 'lucide-react'
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
  foto?: string
}

interface Peminjaman {
  id?: number
  id_user_peminjam?: number
  kendaraan_id: number
  tanggal_mulai: Date
  tanggal_selesai: Date
  tujuan_penggunaan: string
  tujuan_lokasi: string
  status: string
  created_at?: string
  // Pernyataan
  pernyataan_keperluan_dinas: boolean
  pernyataan_kebersihan: boolean
  pernyataan_tanggung_jawab: boolean
  // Lampiran
  lampiran_file: File | null
  lampiran_nama: string
}

interface UserData {
  id_user: number
  nama_lengkap: string
  username: string
  email: string
  role: string
  instansi?: string
}

export default function PeminjamanSystem() {
  const { user } = useAuth()
  const [kendaraan, setKendaraan] = useState<Kendaraan | null>(null)
  const [availableVehicles, setAvailableVehicles] = useState<Kendaraan[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [peminjaman, setPeminjaman] = useState<Peminjaman>({
    id_user_peminjam: user?.id_user || 0,
    kendaraan_id: 0,
    tanggal_mulai: new Date(),
    tanggal_selesai: new Date(),
    tujuan_penggunaan: '',
    tujuan_lokasi: '',
    status: 'pending',
    // Pernyataan
    pernyataan_keperluan_dinas: false,
    pernyataan_kebersihan: false,
    pernyataan_tanggung_jawab: false,
    // Lampiran
    lampiran_file: null,
    lampiran_nama: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [dataLoading, setDataLoading] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5 MB')
        return
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        setError('File yang didukung: PDF, JPG, PNG, DOC, DOCX')
        return
      }

      setPeminjaman(prev => ({
        ...prev,
        lampiran_file: file,
        lampiran_nama: file.name
      }))
      setError('')
    }
  }

  // Remove uploaded file
  const removeFile = () => {
    setPeminjaman(prev => ({
      ...prev,
      lampiran_file: null,
      lampiran_nama: ''
    }))
  }

  // Fetch data dari API
  useEffect(() => {
    fetchUsers()
    fetchAvailableVehicles()
  }, [])

  // Update id_user_peminjam when user changes
  useEffect(() => {
    if (user) {
      setPeminjaman(prev => ({ ...prev, id_user_peminjam: user.id_user }))
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/users/list', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchAvailableVehicles = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/kendaraan', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      if (response.ok) {
        const data = await response.json()
        const available = data.filter((v: Kendaraan) => v.status === 'Tersedia')
        setAvailableVehicles(available)
        
        // Auto-select first vehicle if available
        if (available.length > 0) {
          setKendaraan(available[0])
          setPeminjaman(prev => ({ ...prev, kendaraan_id: available[0].id_kendaraan }))
        }
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Log data for debugging
      console.log('Submitting peminjaman:', {
        id_user_peminjam: peminjaman.id_user_peminjam,
        kendaraan_id: peminjaman.kendaraan_id,
        tanggal_mulai: peminjaman.tanggal_mulai,
        tanggal_selesai: peminjaman.tanggal_selesai,
        tujuan_penggunaan: peminjaman.tujuan_penggunaan,
        tujuan_lokasi: peminjaman.tujuan_lokasi,
        pernyataan_keperluan_dinas: peminjaman.pernyataan_keperluan_dinas,
        pernyataan_kebersihan: peminjaman.pernyataan_kebersihan,
        pernyataan_tanggung_jawab: peminjaman.pernyataan_tanggung_jawab,
        lampiran_file: peminjaman.lampiran_file?.name
      })

      // Validasi
      if (!peminjaman.id_user_peminjam || peminjaman.id_user_peminjam === 0) {
        setError('Username peminjam harus dipilih')
        return
      }

      if (!peminjaman.kendaraan_id || peminjaman.kendaraan_id === 0) {
        setError('Kendaraan harus dipilih')
        return
      }

      if (!peminjaman.tujuan_penggunaan.trim()) {
        setError('Tujuan penggunaan harus diisi')
        return
      }

      if (!peminjaman.tujuan_lokasi.trim()) {
        setError('Tujuan lokasi harus diisi')
        return
      }

      if (peminjaman.tanggal_selesai < peminjaman.tanggal_mulai) {
        setError('Tanggal selesai tidak boleh sebelum tanggal mulai')
        return
      }

      // Validasi pernyataan
      if (!peminjaman.pernyataan_keperluan_dinas) {
        setError('Anda harus menyetujui pernyataan keperluan dinas')
        return
      }

      if (!peminjaman.pernyataan_kebersihan) {
        setError('Anda harus menyetujui pernyataan kebersihan')
        return
      }

      if (!peminjaman.pernyataan_tanggung_jawab) {
        setError('Anda harus menyetujui pernyataan tanggung jawab')
        return
      }

      // Prepare form data for file upload
      const formData = new FormData()
      formData.append('id_kendaraan', peminjaman.kendaraan_id.toString())
      formData.append('id_user_peminjam', peminjaman.id_user_peminjam!.toString())
      
      // Format dates to YYYY-MM-DD format
      const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      
      formData.append('tanggal_pinjam', formatDate(peminjaman.tanggal_mulai))
      formData.append('tanggal_kembali_rencana', formatDate(peminjaman.tanggal_selesai))
      formData.append('tujuan_penggunaan', peminjaman.tujuan_penggunaan)
      formData.append('tujuan_lokasi', peminjaman.tujuan_lokasi)
      formData.append('pernyataan_keperluan_dinas', peminjaman.pernyataan_keperluan_dinas.toString())
      formData.append('pernyataan_kebersihan', peminjaman.pernyataan_kebersihan.toString())
      formData.append('pernyataan_tanggung_jawab', peminjaman.pernyataan_tanggung_jawab.toString())
      
      // Add creator
      if (user) {
        formData.append('id_creator', user.id_user.toString())
      }
      
      if (peminjaman.lampiran_file) {
        formData.append('lampiran', peminjaman.lampiran_file)
      }

      // API call untuk submit peminjaman
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/peminjaman', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      })

      if (response.ok) {
        setMessage('Pengajuan peminjaman berhasil dikirim!')
        
        // Reset form
        setPeminjaman({
          id_user_peminjam: user?.id_user || 0,
          kendaraan_id: availableVehicles.length > 0 ? availableVehicles[0].id_kendaraan : 0,
          tanggal_mulai: new Date(),
          tanggal_selesai: new Date(),
          tujuan_penggunaan: '',
          tujuan_lokasi: '',
          status: 'pending',
          // Pernyataan
          pernyataan_keperluan_dinas: false,
          pernyataan_kebersihan: false,
          pernyataan_tanggung_jawab: false,
          // Lampiran
          lampiran_file: null,
          lampiran_nama: ''
        })
        
        // Refresh available vehicles
        fetchAvailableVehicles()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Gagal mengajukan peminjaman')
      }

    } catch (err) {
      setError('Terjadi kesalahan saat mengajukan peminjaman')
    } finally {
      setLoading(false)
    }
  }

  if (dataLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Ajukan Peminjaman Baru</h1>
          <p className="text-muted-foreground">
            Isi form berikut untuk mengajukan peminjaman kendaraan
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
        {/* Form Peminjaman */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Form Peminjaman
            </CardTitle>
            <CardDescription>
              Lengkapi data peminjaman kendaraan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Peminjam */}
              <div className="space-y-2">
                <Label htmlFor="peminjam">Username Peminjam</Label>
                <Select 
                  value={peminjaman.id_user_peminjam?.toString() || ''} 
                  onValueChange={(value) => setPeminjaman(prev => ({ ...prev, id_user_peminjam: parseInt(value) }))}
                  disabled={user?.role === 'USER'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih username peminjam" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((userItem) => (
                      <SelectItem key={userItem.id_user} value={userItem.id_user.toString()}>
                        {userItem.username} {userItem.nip && `(${userItem.nip})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {user?.role === 'USER' && (
                  <p className="text-xs text-muted-foreground">
                    Anda login sebagai: {user.username} {user.nip && `(${user.nip})`}
                  </p>
                )}
              </div>

              {/* Pilih Kendaraan */}
              <div className="space-y-2">
                <Label htmlFor="kendaraan">Pilih Kendaraan</Label>
                <Select 
                  data-testid="vehicle-select"
                  value={peminjaman.kendaraan_id?.toString() || ''} 
                  onValueChange={(value) => {
                    const vehicleId = parseInt(value)
                    setPeminjaman(prev => ({ ...prev, kendaraan_id: vehicleId }))
                    const selected = availableVehicles.find(v => v.id_kendaraan === vehicleId)
                    setKendaraan(selected || null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kendaraan tersedia" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVehicles.length > 0 ? (
                      availableVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id_kendaraan} value={vehicle.id_kendaraan.toString()}>
                          {vehicle.plat_nomor} - {vehicle.merek} {vehicle.tipe} ({vehicle.tahun})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-vehicles" disabled>
                        Tidak ada kendaraan tersedia
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {peminjaman.tanggal_mulai ? (
                          format(peminjaman.tanggal_mulai, 'PPP', { locale: id })
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={peminjaman.tanggal_mulai}
                        onSelect={(date) => date && setPeminjaman(prev => ({ ...prev, tanggal_mulai: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {peminjaman.tanggal_selesai ? (
                          format(peminjaman.tanggal_selesai, 'PPP', { locale: id })
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={peminjaman.tanggal_selesai}
                        onSelect={(date) => date && setPeminjaman(prev => ({ ...prev, tanggal_selesai: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Tujuan Penggunaan */}
              <div className="space-y-2">
                <Label htmlFor="tujuan_penggunaan">Tujuan Penggunaan</Label>
                <Textarea
                  id="tujuan_penggunaan"
                  placeholder="Jelaskan tujuan penggunaan kendaraan..."
                  value={peminjaman.tujuan_penggunaan}
                  onChange={(e) => setPeminjaman(prev => ({ ...prev, tujuan_penggunaan: e.target.value }))}
                  rows={2}
                />
              </div>

              {/* Tujuan Lokasi */}
              <div className="space-y-2">
                <Label htmlFor="tujuan_lokasi">Tujuan Lokasi Perjalanan</Label>
                <Input
                  id="tujuan_lokasi"
                  placeholder="Masukkan lokasi tujuan perjalanan..."
                  value={peminjaman.tujuan_lokasi}
                  onChange={(e) => setPeminjaman(prev => ({ ...prev, tujuan_lokasi: e.target.value }))}
                />
              </div>

              {/* Pernyataan */}
              <div className="space-y-4 border-t pt-4">
                <Label className="text-base font-semibold">Pernyataan Peminjam</Label>
                
                {/* Pernyataan 1 */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="pernyataan_keperluan_dinas"
                      checked={peminjaman.pernyataan_keperluan_dinas}
                      onCheckedChange={(checked) => 
                        setPeminjaman(prev => ({ ...prev, pernyataan_keperluan_dinas: checked as boolean }))
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="pernyataan_keperluan_dinas"
                        className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Dengan ini menyatakan bahwa kendaraan dinas hanya akan digunakan sesuai keperluan dinas
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Pernyataan 2 */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="pernyataan_kebersihan"
                      checked={peminjaman.pernyataan_kebersihan}
                      onCheckedChange={(checked) => 
                        setPeminjaman(prev => ({ ...prev, pernyataan_kebersihan: checked as boolean }))
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="pernyataan_kebersihan"
                        className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Dengan ini menyatakan akan menjaga kebersihan kendaraan dinas
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Pernyataan 3 */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="pernyataan_tanggung_jawab"
                      checked={peminjaman.pernyataan_tanggung_jawab}
                      onCheckedChange={(checked) => 
                        setPeminjaman(prev => ({ ...prev, pernyataan_tanggung_jawab: checked as boolean }))
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="pernyataan_tanggung_jawab"
                        className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Dengan ini menyatakan akan bertanggung jawab atas kerusakan yang ditimbulkan karena kelalaian pemakaian kendaraan dinas
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Lampiran */}
              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="lampiran" className="text-base font-semibold">
                  Upload Lampiran Pendukung (SPT/bukti lainnya)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Upload 1 file yang didukung. Maks 5 MB.
                </p>
                
                {peminjaman.lampiran_file ? (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{peminjaman.lampiran_nama}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(peminjaman.lampiran_file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700"
                    >
                      Hapus
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <Label
                      htmlFor="lampiran"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG, PNG, DOC, DOCX (MAX. 5MB)
                        </p>
                      </div>
                      <Input
                        id="lampiran"
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </Label>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || availableVehicles.length === 0}
              >
                {loading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Mengajukan...
                  </>
                ) : (
                  'Ajukan Peminjaman'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informasi Kendaraan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Informasi Kendaraan Dipilih
            </CardTitle>
            <CardDescription>
              Detail kendaraan yang akan dipinjam
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {kendaraan ? (
              <>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <h3 className="font-semibold">{kendaraan.plat_nomor} - {kendaraan.merek} {kendaraan.tipe}</h3>
                    <p className="text-sm text-muted-foreground">Tahun {kendaraan.tahun}</p>
                  </div>
                  <Badge variant={kendaraan.status === 'Tersedia' ? 'default' : 'secondary'}>
                    {kendaraan.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Kondisi: {kendaraan.kondisi_layak}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Kebersihan: {kendaraan.kebersihan}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Fuel className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Bahan Bakar: {kendaraan.sisa_bensin} L</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Belum ada kendaraan dipilih</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistik Kendaraan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Statistik Ketersediaan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Kendaraan Tersedia</span>
                <span className="text-sm font-medium text-green-600">{availableVehicles.length} unit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Kendaraan Layak Jalan</span>
                <span className="text-sm font-medium text-blue-600">
                  {availableVehicles.filter(v => v.kondisi_layak === 'Layak').length} unit
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Kendaraan Bersih</span>
                <span className="text-sm font-medium text-green-600">
                  {availableVehicles.filter(v => v.kebersihan === 'Bersih').length} unit
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}