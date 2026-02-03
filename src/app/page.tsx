'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Download, User, Phone, MapPin, Calendar, Shield } from 'lucide-react'
import { toast } from 'sonner'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedWorker, setSelectedWorker] = useState<any>(null)
  const [selectedRole, setSelectedRole] = useState('Brand Ambassador')
  const [selectedTerritory, setSelectedTerritory] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('MERU MOUNTAIN')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [territories, setTerritories] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchTerritories()
  }, [])

  const fetchTerritories = async () => {
    try {
      const response = await fetch('/api/territories')
      const data = await response.json()
      setTerritories(data)
      if (data.length > 0) {
        setSelectedTerritory(data[0].name)
      }
    } catch (error) {
      console.error('Error fetching territories:', error)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length < 5) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/workers?q=${query}`)
      const data = await response.json()

      if (data.length === 0) {
        toast.error('No workers found')
        setSearchResults([])
        setShowDropdown(false)
      } else if (data.length === 1) {
        // Auto-select if only one match
        const worker = data[0]
        setSelectedWorker(worker)
        setSearchQuery(worker.idNumber)
        setShowDropdown(false)
        toast.success('Worker found: ' + worker.name)
      } else {
        setSearchResults(data)
        setShowDropdown(true)
      }
    } catch (error) {
      console.error('Error searching workers:', error)
      toast.error('Failed to search workers')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWorkerSelect = (worker: any) => {
    setSelectedWorker(worker)
    setSearchQuery(worker.idNumber)
    setSelectedTerritory(worker.territory || territories[0]?.name || '')
    setShowDropdown(false)
    toast.success('Worker selected: ' + worker.name)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownloadCard = async () => {
    if (!selectedWorker) {
      toast.error('Please select a worker first')
      return
    }

    if (!photoPreview) {
      toast.error('Please upload a photo')
      return
    }

    toast.info('ID card generation feature coming soon!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-900">Mayaash Communication</h1>
              <p className="text-sm text-green-600">ID Card System</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/admin'}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Search Section */}
          <Card className="border-green-200 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-900">Generate Your ID Card</CardTitle>
              <CardDescription>
                Enter your ID number to search for your record and generate your professional ID card
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Input */}
              <div className="space-y-2">
                <Label htmlFor="id-search" className="text-green-900 font-semibold">
                  ID Number (minimum 5 digits)
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <Input
                    id="id-search"
                    type="text"
                    placeholder="Enter first 5+ digits of your ID number"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-500 border-t-transparent" />
                    </div>
                  )}
                </div>

                {/* Search Dropdown */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-green-200 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto">
                    {searchResults.map((worker) => (
                      <button
                        key={worker.id}
                        onClick={() => handleWorkerSelect(worker)}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-green-100 last:border-0 transition-colors"
                      >
                        <div className="font-medium text-green-900">{worker.name}</div>
                        <div className="text-sm text-green-600">
                          ID: {worker.idNumber} | Phone: {worker.phoneNumber}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Worker Info */}
              {selectedWorker && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <Label className="text-green-700">Name</Label>
                          <p className="text-green-900 font-semibold">{selectedWorker.name}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-green-700">ID Number</Label>
                            <p className="text-green-900">{selectedWorker.idNumber}</p>
                          </div>
                          <div>
                            <Label className="text-green-700">Phone Number</Label>
                            <p className="text-green-900">{selectedWorker.phoneNumber}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Role and Territory Selection */}
              {selectedWorker && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-green-900 font-semibold">
                      Role
                    </Label>
                    <select
                      id="role"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Brand Ambassador">Brand Ambassador</option>
                      <option value="Team Leader">Team Leader</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="territory" className="text-green-900 font-semibold">
                      Territory
                    </Label>
                    <select
                      id="territory"
                      value={selectedTerritory}
                      onChange={(e) => setSelectedTerritory(e.target.value)}
                      className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {territories.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Region Selection */}
              {selectedWorker && (
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-green-900 font-semibold">
                    Region
                  </Label>
                  <select
                    id="region"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="MERU MOUNTAIN">MERU MOUNTAIN</option>
                  </select>
                </div>
              )}

              {/* Photo Upload */}
              {selectedWorker && (
                <div className="space-y-2">
                  <Label htmlFor="photo" className="text-green-900 font-semibold">
                    Passport Photo
                  </Label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        ref={fileInputRef}
                        className="border-green-300"
                      />
                      <p className="text-sm text-green-600 mt-1">
                        Recommended: 130px x 170px (passport size)
                      </p>
                    </div>
                    {photoPreview && (
                      <div className="w-24 h-32 border-2 border-green-300 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Download Button */}
              {selectedWorker && (
                <Button
                  onClick={handleDownloadCard}
                  disabled={!photoPreview}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download ID Card
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <User className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-green-900">73 Workers</h3>
                <p className="text-sm text-green-600">Registered employees</p>
              </CardContent>
            </Card>
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <MapPin className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-green-900">31 Territories</h3>
                <p className="text-sm text-green-600">Coverage areas</p>
              </CardContent>
            </Card>
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <Shield className="w-8 h-8 text-green-600 mb-2" />
                <h3 className="font-semibold text-green-900">Secure System</h3>
                <p className="text-sm text-green-600">Protected access</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-green-700">
          <p>&copy; 2025 Mayaash Communication Limited. All rights reserved.</p>
          <p className="text-xs mt-1">Need support? Contact: serabsales@gmail.com | 0747047555</p>
        </div>
      </footer>
    </div>
  )
}
