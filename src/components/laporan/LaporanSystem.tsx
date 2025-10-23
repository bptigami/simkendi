'use client'

import { useState, useEffect } from 'react'
import { Search, Download, Calendar, Filter, FileText, BarChart3, MapPin, Car, User, FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface ReportData {
  filter: {
    startDate: string | null
    endDate: string | null
    status: string | null
  }
  stats: {
    total: number
    disetujui: number
    ditolak: number
    diproses: number
    selesai: number
    totalDurasi: number
    rataRataDurasi: number
  }
  peminjaman: Array<{
    id_peminjaman: number
    plat_nomor: string
    merek: string
    tipe: string
    nama_peminjam: string
    nip: string
    jabatan: string
    instansi: string
    tanggal_pinjam: string
    tanggal_kembali_rencana: string
    tanggal_kembali_aktual: string | null
    tujuan_penggunaan: string
    tujuan_lokasi: string
    status: string
    kondisi_awal_layak: string
    kondisi_akhir_layak: string | null
    catatan_petugas: string | null
  }>
  lokasiStats: Array<{
    lokasi: string
    count: number
  }>
  kendaraanStats: Array<{
    kendaraan: string
    count: number
  }>
  peminjamStats: Array<{
    peminjam: string
    count: number
  }>
  generatedAt: string
}

export default function LaporanSystem() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPeminjaman, setFilteredPeminjaman] = useState<ReportData['peminjaman']>([])

  useEffect(() => {
    if (reportData) {
      const filtered = reportData.peminjaman.filter(peminjaman =>
        peminjaman.plat_nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (peminjaman.nama_peminjam || 'Tidak diketahui').toLowerCase().includes(searchTerm.toLowerCase()) ||
        peminjaman.tujuan_penggunaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        peminjaman.tujuan_lokasi.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPeminjaman(filtered)
    }
  }, [searchTerm, reportData])

  const generateReport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      if (filters.status !== 'all') params.append('status', filters.status)

      const response = await fetch(`/api/laporan?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      if (filters.status !== 'all') params.append('status', filters.status)
      params.append('format', 'csv')

      const response = await fetch(`/api/laporan?${params.toString()}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `laporan-peminjaman-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading CSV:', error)
    }
  }

  const downloadPDF = async () => {
    if (!reportData) return

    try {
      setLoading(true)
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // Header with logo placeholder (square box for now)
       const logoUrl = '/logo_kp2mi.png'
  const logoResponse = await fetch(logoUrl)
  const logoBlob = await logoResponse.blob()
  const logoBase64 = await new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(logoBlob)
  })

  // Tambahkan logo ke PDF (posisi x=15, y=10, ukuran 30x30 mm)
  pdf.addImage(logoBase64, 'PNG', 15, 10, 30, 30)
      
      // Kop surat
     let textX = 50 // mulai agak kanan setelah logo (15 + 30 + 5)
let textY = 15

pdf.setFontSize(12)
pdf.setFont('helvetica', 'normal')
pdf.text('KEMENTERIAN PELINDUNGAN PEKERJA MIGRAN INDONESIA/', textX, textY)
pdf.text('BADAN PELINDUNGAN PEKERJA MIGRAN INDONESIA', textX, textY + 6)

pdf.setFontSize(12)
pdf.setFont('helvetica', 'bold')
pdf.text('BALAI PELAYANAN PELINDUNGAN PEKERJA MIGRAN INDONESIA –', textX, textY + 12)
pdf.text('JAWA TENGAH', textX, textY + 18)

pdf.setFontSize(10)
pdf.setFont('helvetica', 'normal')
pdf.text('Jalan Kalipepe III No.64 Pudakpayung, Banyumanik, Kota Semarang, Jawa Tengah 50265', textX, textY + 24)
pdf.text('Telepon: (024) 76481772, email: bp3mi.jateng@bp2mi.go.id', textX, textY + 29)
      
      // Garis
      pdf.setLineWidth(0.5)
      pdf.line(15, 48, pageWidth - 15, 48)
      
      // Judul Laporan
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('LAPORAN PEMINJAMAN KENDARAAN', pageWidth / 2, 58, { align: 'center' })
      
      // Periode
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      let periodeText = 'Periode: '
      if (reportData.filter.startDate && reportData.filter.endDate) {
        periodeText += `${new Date(reportData.filter.startDate).toLocaleDateString('id-ID')} s/d ${new Date(reportData.filter.endDate).toLocaleDateString('id-ID')}`
      } else {
        periodeText += 'Semua Data'
      }
      pdf.text(periodeText, pageWidth / 2, 65, { align: 'center' })
      
      // Tanggal generate
      pdf.text(`Generate: ${new Date(reportData.generatedAt).toLocaleString('id-ID')}`, pageWidth / 2, 71, { align: 'center' })
      
      let yPosition = 80
      
 pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text('DETAIL PEMINJAMAN', 15, yPosition)
      yPosition += 10
      
      // Table headers
      const headers = ['ID', 'Plat Nomor', 'Peminjam', 'Tgl Pinjam', 'Tgl Kembali', 'Lokasi', 'Status']
      const columnWidths = [15, 30, 40, 25, 25, 35, 20]
      let xPos = 15
      
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'bold')
      headers.forEach((header, index) => {
        pdf.text(header, xPos, yPosition)
        xPos += columnWidths[index]
      })
      yPosition += 6
      
      // Table line
      pdf.line(15, yPosition, pageWidth - 15, yPosition)
      yPosition += 4
      
      // Table data
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      
      const dataToShow = filteredPeminjaman.slice(0, 50) // Max 50 rows for PDF
      
      dataToShow.forEach((peminjaman) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 20) {
          pdf.addPage()
          yPosition = 20
          
          // Repeat headers on new page
          pdf.setFontSize(9)
          pdf.setFont('helvetica', 'bold')
          xPos = 15
          headers.forEach((header, index) => {
            pdf.text(header, xPos, yPosition)
            xPos += columnWidths[index]
          })
          yPosition += 6
          pdf.line(15, yPosition, pageWidth - 15, yPosition)
          yPosition += 4
          pdf.setFontSize(8)
          pdf.setFont('helvetica', 'normal')
        }
        
        xPos = 15
        pdf.text(peminjaman.id_peminjaman.toString(), xPos, yPosition)
        xPos += columnWidths[0]
        
        // Truncate long text
        pdf.text(peminjaman.plat_nomor.length > 8 ? peminjaman.plat_nomor.substring(0, 8) + '...' : peminjaman.plat_nomor, xPos, yPosition)
        xPos += columnWidths[1]
        
        const namaPeminjam = peminjaman.nama_peminjam || 'Tidak diketahui'
        pdf.text(namaPeminjam.length > 12 ? namaPeminjam.substring(0, 12) + '...' : namaPeminjam, xPos, yPosition)
        xPos += columnWidths[2]
        
        pdf.text(new Date(peminjaman.tanggal_pinjam).toLocaleDateString('id-ID'), xPos, yPosition)
        xPos += columnWidths[3]
        
        pdf.text(new Date(peminjaman.tanggal_kembali_rencana).toLocaleDateString('id-ID'), xPos, yPosition)
        xPos += columnWidths[4]
        
        pdf.text(peminjaman.tujuan_lokasi.length > 15 ? peminjaman.tujuan_lokasi.substring(0, 15) + '...' : peminjaman.tujuan_lokasi, xPos, yPosition)
        xPos += columnWidths[5]
        
        pdf.text(peminjaman.status, xPos, yPosition)
        yPosition += 5
      })

      pdf.addPage()
      yPosition = 20
      
      // Statistik
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.text('RINGKASAN STATISTIK', 15, yPosition)
      yPosition += 8
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Total Peminjaman: ${reportData.stats.total}`, 20, yPosition)
      yPosition += 6
      pdf.text(`Disetujui: ${reportData.stats.disetujui} (${reportData.stats.total > 0 ? Math.round((reportData.stats.disetujui / reportData.stats.total) * 100) : 0}%)`, 20, yPosition)
      yPosition += 6
      pdf.text(`Ditolak: ${reportData.stats.ditolak} (${reportData.stats.total > 0 ? Math.round((reportData.stats.ditolak / reportData.stats.total) * 100) : 0}%)`, 20, yPosition)
      yPosition += 6
      pdf.text(`Diproses: ${reportData.stats.diproses} (${reportData.stats.total > 0 ? Math.round((reportData.stats.diproses / reportData.stats.total) * 100) : 0}%)`, 20, yPosition)
      yPosition += 6
      pdf.text(`Selesai: ${reportData.stats.selesai} (${reportData.stats.total > 0 ? Math.round((reportData.stats.selesai / reportData.stats.total) * 100) : 0}%)`, 20, yPosition)
      yPosition += 6
      pdf.text(`Rata-rata Durasi: ${reportData.stats.rataRataDurasi} hari`, 20, yPosition)
      yPosition += 12
      
      // Top Lokasi
      if (reportData.lokasiStats.length > 0) {
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('LOKASI TERPOPULER', 15, yPosition)
        yPosition += 8
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        reportData.lokasiStats.slice(0, 5).forEach((item) => {
          pdf.text(`• ${item.lokasi}: ${item.count} peminjaman`, 20, yPosition)
          yPosition += 6
        })
        yPosition += 6
      }
      
      // Top Kendaraan
      if (reportData.kendaraanStats.length > 0) {
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('KENDARAAN TERPOPULER', 15, yPosition)
        yPosition += 8
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        reportData.kendaraanStats.slice(0, 5).forEach((item) => {
          pdf.text(`• ${item.kendaraan}: ${item.count} peminjaman`, 20, yPosition)
          yPosition += 6
        })
        yPosition += 6
      }
      
      // Top Peminjam
      if (reportData.peminjamStats.length > 0) {
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('PEMINJAM TERAKTIF', 15, yPosition)
        yPosition += 8
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        reportData.peminjamStats.slice(0, 5).forEach((item) => {
          pdf.text(`• ${item.peminjam}: ${item.count} peminjaman`, 20, yPosition)
          yPosition += 6
        })
        yPosition += 6
      }
      
      // New page for detail table

     
      
      // Footer
      const totalPages = pdf.internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'italic')
        pdf.text(`Halaman ${i} dari ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
      }
      
      // Save PDF
      pdf.save(`laporan-peminjaman-${new Date().toISOString().split('T')[0]}.pdf`)
      setLoading(false)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Laporan Peminjaman</h2>
          <p className="text-gray-600">Generate dan download laporan peminjaman kendaraan</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={downloadPDF}
            disabled={!reportData || loading}
            className="bg-red-600 hover:bg-red-700"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button
            onClick={downloadCSV}
            disabled={!reportData || loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
          <Button
            onClick={generateReport}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {loading ? 'Memuat...' : 'Generate Laporan'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Filter Laporan</CardTitle>
          <CardDescription>Atur filter untuk laporan yang ingin dibuat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="startDate">Tanggal Mulai</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Tanggal Selesai</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
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
            <div className="flex items-end">
              <Button
                onClick={generateReport}
                disabled={loading}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Terapkan Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <div id="laporan-content">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Peminjaman</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{reportData.stats.total}</div>
                <p className="text-xs text-gray-500">Total transaksi</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Disetujui</CardTitle>
                <div className="h-4 w-4 bg-green-500 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{reportData.stats.disetujui}</div>
                <p className="text-xs text-gray-500">
                  {reportData.stats.total > 0 ? Math.round((reportData.stats.disetujui / reportData.stats.total) * 100) : 0}% dari total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Selesai</CardTitle>
                <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{reportData.stats.selesai}</div>
                <p className="text-xs text-gray-500">
                  {reportData.stats.total > 0 ? Math.round((reportData.stats.selesai / reportData.stats.total) * 100) : 0}% dari total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Rata-rata Durasi</CardTitle>
                <Calendar className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{reportData.stats.rataRataDurasi}</div>
                <p className="text-xs text-gray-500">Hari</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  Lokasi Terpopuler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {reportData.lokasiStats.slice(0, 10).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{item.lokasi}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Car className="h-5 w-5 mr-2 text-blue-600" />
                  Kendaraan Terpopuler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {reportData.kendaraanStats.slice(0, 10).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{item.kendaraan}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Peminjam Teraktif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {reportData.peminjamStats.slice(0, 10).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{item.peminjam}</span>
                      <Badge variant="secondary">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Report */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Detail Peminjaman</CardTitle>
              <CardDescription>
                Total {filteredPeminjaman.length} dari {reportData.peminjaman.length} peminjaman
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari peminjaman..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Kendaraan</th>
                      <th className="text-left p-2">Peminjam</th>
                      <th className="text-left p-2">Tanggal</th>
                      <th className="text-left p-2">Lokasi</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPeminjaman.slice(0, 20).map((peminjaman) => (
                      <tr key={peminjaman.id_peminjaman} className="border-b hover:bg-gray-50">
                        <td className="p-2">{peminjaman.id_peminjaman}</td>
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{peminjaman.plat_nomor}</div>
                            <div className="text-xs text-gray-500">{peminjaman.merek} {peminjaman.tipe}</div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{peminjaman.nama_peminjam || 'Tidak diketahui'}</div>
                            <div className="text-xs text-gray-500">{peminjaman.nip}</div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div>
                            <div className="text-xs">{new Date(peminjaman.tanggal_pinjam).toLocaleDateString('id-ID')}</div>
                            <div className="text-xs text-gray-500">s/d {new Date(peminjaman.tanggal_kembali_rencana).toLocaleDateString('id-ID')}</div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="max-w-xs truncate" title={peminjaman.tujuan_lokasi}>
                            {peminjaman.tujuan_lokasi}
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge className={getStatusColor(peminjaman.status)}>
                            {peminjaman.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredPeminjaman.length > 20 && (
                <div className="text-center mt-4 text-sm text-gray-500">
                  Menampilkan 20 dari {filteredPeminjaman.length} peminjaman. Download CSV untuk melihat semua data.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {!reportData && !loading && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Pilih filter dan klik "Generate Laporan" untuk membuat laporan</p>
        </div>
      )}
    </div>
  )
}