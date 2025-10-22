'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Kendaraan {
  id_kendaraan: number
  plat_nomor: string
  merek: string
  tipe: string
  tahun: number
  kondisi_layak: string
  kebersihan: string
  sisa_bensin: number
  status: string
  createdAt: string
  updatedAt: string
}

export default function KendaraanManagement() {
  const [kendaraanList, setKendaraanList] = useState<Kendaraan[]>([])
  const [filteredKendaraan, setFilteredKendaraan] = useState<Kendaraan[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingKendaraan, setEditingKendaraan] = useState<Kendaraan | null>(null)
  const [formData, setFormData] = useState({
    plat_nomor: '',
    merek: '',
    tipe: '',
    tahun: '',
    kondisi_layak: 'Layak',
    kebersihan: 'Bersih',
    sisa_bensin: '',
    status: 'Tersedia'
  })

  useEffect(() => {
    fetchKendaraan()
  }, [])

  useEffect(() => {
    const filtered = kendaraanList.filter(kendaraan =>
      kendaraan.plat_nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kendaraan.merek.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kendaraan.tipe.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredKendaraan(filtered)
  }, [searchTerm, kendaraanList])

  const fetchKendaraan = async () => {
    try {
      const response = await fetch('/api/kendaraan')
      if (response.ok) {
        const data = await response.json()
        setKendaraanList(data)
      }
    } catch (error) {
      console.error('Error fetching kendaraan:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingKendaraan 
        ? `/api/kendaraan/${editingKendaraan.id_kendaraan}`
        : '/api/kendaraan'
      
      const method = editingKendaraan ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tahun: parseInt(formData.tahun),
          sisa_bensin: parseFloat(formData.sisa_bensin) || 0
        })
      })

      if (response.ok) {
        await fetchKendaraan()
        setDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving kendaraan:', error)
    }
  }

  const handleEdit = (kendaraan: Kendaraan) => {
    setEditingKendaraan(kendaraan)
    setFormData({
      plat_nomor: kendaraan.plat_nomor,
      merek: kendaraan.merek,
      tipe: kendaraan.tipe,
      tahun: kendaraan.tahun.toString(),
      kondisi_layak: kendaraan.kondisi_layak,
      kebersihan: kendaraan.kebersihan,
      sisa_bensin: kendaraan.sisa_bensin.toString(),
      status: kendaraan.status
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus kendaraan ini?')) {
      try {
        const response = await fetch(`/api/kendaraan/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          await fetchKendaraan()
        }
      } catch (error) {
        console.error('Error deleting kendaraan:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      plat_nomor: '',
      merek: '',
      tipe: '',
      tahun: '',
      kondisi_layak: 'Layak',
      kebersihan: 'Bersih',
      sisa_bensin: '',
      status: 'Tersedia'
    })
    setEditingKendaraan(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tersedia': return 'bg-green-100 text-green-800'
      case 'Dipinjam': return 'bg-yellow-100 text-yellow-800'
      case 'Dalam Perawatan': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getKondisiColor = (kondisi: string) => {
    switch (kondisi) {
      case 'Layak':
      case 'Bersih': return 'bg-green-100 text-green-800'
      case 'Tidak Layak':
      case 'Perlu Dibersihkan': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Memuat data kendaraan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Kendaraan</h2>
          <p className="text-gray-600">Kelola data kendaraan dinas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kendaraan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingKendaraan ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingKendaraan ? 'Edit data kendaraan yang ada.' : 'Tambahkan kendaraan baru ke sistem.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="plat_nomor" className="text-right">
                    Plat Nomor
                  </Label>
                  <Input
                    id="plat_nomor"
                    value={formData.plat_nomor}
                    onChange={(e) => setFormData({ ...formData, plat_nomor: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="merek" className="text-right">
                    Merek
                  </Label>
                  <Input
                    id="merek"
                    value={formData.merek}
                    onChange={(e) => setFormData({ ...formData, merek: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tipe" className="text-right">
                    Tipe
                  </Label>
                  <Input
                    id="tipe"
                    value={formData.tipe}
                    onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tahun" className="text-right">
                    Tahun
                  </Label>
                  <Input
                    id="tahun"
                    type="number"
                    value={formData.tahun}
                    onChange={(e) => setFormData({ ...formData, tahun: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="kondisi_layak" className="text-right">
                    Kondisi
                  </Label>
                  <Select
                    value={formData.kondisi_layak}
                    onValueChange={(value) => setFormData({ ...formData, kondisi_layak: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Layak">Layak</SelectItem>
                      <SelectItem value="Tidak Layak">Tidak Layak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="kebersihan" className="text-right">
                    Kebersihan
                  </Label>
                  <Select
                    value={formData.kebersihan}
                    onValueChange={(value) => setFormData({ ...formData, kebersihan: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bersih">Bersih</SelectItem>
                      <SelectItem value="Perlu Dibersihkan">Perlu Dibersihkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sisa_bensin" className="text-right">
                    Sisa Bensin (L)
                  </Label>
                  <Input
                    id="sisa_bensin"
                    type="number"
                    step="0.1"
                    value={formData.sisa_bensin}
                    onChange={(e) => setFormData({ ...formData, sisa_bensin: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tersedia">Tersedia</SelectItem>
                      <SelectItem value="Dipinjam">Dipinjam</SelectItem>
                      <SelectItem value="Dalam Perawatan">Dalam Perawatan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingKendaraan ? 'Update' : 'Simpan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Cari kendaraan berdasarkan plat nomor, merek, atau tipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Kendaraan List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKendaraan.map((kendaraan) => (
          <Card key={kendaraan.id_kendaraan} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Car className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{kendaraan.plat_nomor}</CardTitle>
                </div>
                <Badge className={getStatusColor(kendaraan.status)}>
                  {kendaraan.status}
                </Badge>
              </div>
              <CardDescription>
                {kendaraan.merek} {kendaraan.tipe} - {kendaraan.tahun}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Kondisi:</span>
                  <Badge className={getKondisiColor(kendaraan.kondisi_layak)}>
                    {kendaraan.kondisi_layak}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Kebersihan:</span>
                  <Badge className={getKondisiColor(kendaraan.kebersihan)}>
                    {kendaraan.kebersihan}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sisa Bensin:</span>
                  <span className="text-sm font-medium">{kendaraan.sisa_bensin} L</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(kendaraan)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(kendaraan.id_kendaraan)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredKendaraan.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Tidak ada kendaraan yang ditemukan</p>
        </div>
      )}
    </div>
  )
}