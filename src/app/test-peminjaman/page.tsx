'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Navigation } from '@/components/layout/Navigation'

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

export default function TestPeminjamanPage() {
  const [vehicles, setVehicles] = useState<Kendaraan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        setError('No auth token found')
        return
      }

      const response = await fetch('/api/kendaraan', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('All vehicles:', data)
        const available = data.filter((v: Kendaraan) => v.status === 'Tersedia')
        console.log('Available vehicles:', available)
        setVehicles(available)
      } else {
        setError(`Failed to fetch: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      setError(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Vehicle API</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Vehicles ({vehicles.length})</h3>
              {vehicles.map((vehicle) => (
                <div key={vehicle.id_kendaraan} className="p-4 border rounded">
                  <p><strong>Plate:</strong> {vehicle.plat_nomor}</p>
                  <p><strong>Vehicle:</strong> {vehicle.merek} {vehicle.tipe} ({vehicle.tahun})</p>
                  <p><strong>Status:</strong> {vehicle.status}</p>
                  <p><strong>Condition:</strong> {vehicle.kondisi_layak}</p>
                  <p><strong>Cleanliness:</strong> {vehicle.kebersihan}</p>
                  <p><strong>Fuel:</strong> {vehicle.sisa_bensin}L</p>
                </div>
              ))}
            </div>

            <Button onClick={fetchVehicles} className="mt-4">
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}