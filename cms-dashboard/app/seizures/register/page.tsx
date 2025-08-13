"use client"

import type React from "react"

import { useState, useRef } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, MapPin, Upload, Save, Send, X, Wifi, WifiOff, Clock, FileText, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { apiPost } from "@/lib/api"

interface SeizureData {
  contrabandType: string
  category: string
  quantity: string
  unit: string
  serialNumber: string
  seizureTime: string
  location: {
    lat: number | null
    lon: number | null
    address: string
  }
  locationType: string
  seizedBy: string
  agency: string
  notes: string
  photos: File[]
  documents: File[]
  storageAssignment: string
}

const contrabandTypes = [
  "Drugs",
  "Weapons",
  "Explosives",
  "Counterfeit Currency",
  "Stolen Goods",
  "Wildlife Products",
  "Prohibited Electronics",
  "Other",
]

const categories = {
  Drugs: ["Cocaine", "Heroin", "Cannabis", "Synthetic Drugs", "Prescription Drugs"],
  Weapons: ["Firearms", "Ammunition", "Knives", "Explosives"],
  "Counterfeit Currency": ["USD", "EUR", "ETB", "Other Currency"],
  "Stolen Goods": ["Vehicles", "Electronics", "Jewelry", "Documents"],
  Other: ["Unclassified"],
}

const units = ["kg", "g", "pieces", "liters", "boxes", "bags", "units"]
const locationTypes = ["Road", "Checkpoint", "Home", "Market", "Vehicle", "Airport", "Border", "Other"]

export default function RegisterSeizurePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentPath] = useState("/seizures/register")
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isDraft, setIsDraft] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)

  const [seizureData, setSeizureData] = useState<SeizureData>({
    contrabandType: "",
    category: "",
    quantity: "",
    unit: "",
    serialNumber: "",
    seizureTime: new Date().toISOString().slice(0, 16),
    location: {
      lat: null,
      lon: null,
      address: "",
    },
    locationType: "",
    seizedBy: user?.name || "",
    agency: "Ethiopian Federal Police",
    notes: "",
    photos: [],
    documents: [],
    storageAssignment: "",
  })

  const handleInputChange = (field: string, value: any) => {
    setSeizureData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleLocationChange = (field: string, value: any) => {
    setSeizureData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }))
  }

  const captureGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSeizureData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
          }))
        },
        (error) => {
          console.error("GPS capture failed:", error)
        },
      )
    }
  }

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSeizureData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }))
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSeizureData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }))
  }

  const removePhoto = (index: number) => {
    setSeizureData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const removeDocument = (index: number) => {
    setSeizureData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  const saveDraft = async () => {
    setIsDraft(true)
    // In real app, save to localStorage and sync when online
    localStorage.setItem("seizure_draft", JSON.stringify(seizureData))
    setTimeout(() => setIsDraft(false), 1000)
  }

  const submitSeizure = async () => {
    setIsSubmitting(true)
    try {
      await apiPost<{ id: string; contrabandCode: string }>("/seizures", seizureData)

      // Clear draft
      localStorage.removeItem("seizure_draft")

      // Redirect to seizure detail or list
      router.push("/seizures")
    } catch (error) {
      console.error("Submission failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableCategories = seizureData.contrabandType
    ? categories[seizureData.contrabandType as keyof typeof categories] || []
    : []

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthGuard requiredRoles={["Field Officer", "Supervisor", "Admin"]}>
      <div className="min-h-screen bg-background">
        <DashboardHeader userRole={user.role} userName={user.name} notificationCount={7} />

        <div className="flex h-[calc(100vh-4rem)]">
          <DashboardSidebar userRole={user.role} currentPath={currentPath} />

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Register Seizure</h1>
                  <p className="text-muted-foreground">Capture seizure details and evidence</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center space-x-1">
                    {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                    <span>{isOnline ? "Online" : "Offline"}</span>
                  </Badge>
                  {isDraft && (
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Draft Saved</span>
                    </Badge>
                  )}
                </div>
              </div>

              {/* Form */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Form - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Primary Fields */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Primary Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contrabandType">Contraband Type *</Label>
                          <Select
                            value={seizureData.contrabandType}
                            onValueChange={(value) => handleInputChange("contrabandType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {contrabandTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">Category *</Label>
                          <Select
                            value={seizureData.category}
                            onValueChange={(value) => handleInputChange("category", value)}
                            disabled={!seizureData.contrabandType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity *</Label>
                          <Input
                            id="quantity"
                            type="number"
                            value={seizureData.quantity}
                            onChange={(e) => handleInputChange("quantity", e.target.value)}
                            placeholder="Enter quantity"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="unit">Unit *</Label>
                          <Select value={seizureData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="serialNumber">Serial Number / Identifier</Label>
                          <Input
                            id="serialNumber"
                            value={seizureData.serialNumber}
                            onChange={(e) => handleInputChange("serialNumber", e.target.value)}
                            placeholder="Enter serial number or unique identifier"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Seizure Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Seizure Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="seizureTime">Seizure Time</Label>
                          <Input
                            id="seizureTime"
                            type="datetime-local"
                            value={seizureData.seizureTime}
                            onChange={(e) => handleInputChange("seizureTime", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="locationType">Location Type</Label>
                          <Select
                            value={seizureData.locationType}
                            onValueChange={(value) => handleInputChange("locationType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select location type" />
                            </SelectTrigger>
                            <SelectContent>
                              {locationTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>GPS Location</Label>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={captureGPS}
                            className="flex items-center bg-transparent"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Capture GPS
                          </Button>
                          {seizureData.location.lat && seizureData.location.lon && (
                            <Badge variant="outline">
                              {seizureData.location.lat.toFixed(6)}, {seizureData.location.lon.toFixed(6)}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="locationAddress">Location Address</Label>
                        <Input
                          id="locationAddress"
                          value={seizureData.location.address}
                          onChange={(e) => handleLocationChange("address", e.target.value)}
                          placeholder="Enter location description"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="seizedBy">Seized By</Label>
                          <Input
                            id="seizedBy"
                            value={seizureData.seizedBy}
                            onChange={(e) => handleInputChange("seizedBy", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="agency">Agency</Label>
                          <Input
                            id="agency"
                            value={seizureData.agency}
                            onChange={(e) => handleInputChange("agency", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={seizureData.notes}
                          onChange={(e) => handleInputChange("notes", e.target.value)}
                          placeholder="Additional notes and observations"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Media & Documents */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Media & Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Photos */}
                      <div className="space-y-2">
                        <Label>Photos</Label>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => photoInputRef.current?.click()}
                            className="flex items-center"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Take Photo
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => photoInputRef.current?.click()}
                            className="flex items-center"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photo
                          </Button>
                        </div>
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          capture="environment"
                          onChange={handlePhotoCapture}
                          className="hidden"
                        />
                        {seizureData.photos.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {seizureData.photos.map((photo, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(photo) || "/placeholder.svg"}
                                  alt={`Photo ${index + 1}`}
                                  className="w-full h-20 object-cover rounded border"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                  onClick={() => removePhoto(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Documents */}
                      <div className="space-y-2">
                        <Label>Documents</Label>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => documentInputRef.current?.click()}
                          className="flex items-center"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Attach Document
                        </Button>
                        <input
                          ref={documentInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          multiple
                          onChange={handleDocumentUpload}
                          className="hidden"
                        />
                        {seizureData.documents.length > 0 && (
                          <div className="space-y-2 mt-2">
                            {seizureData.documents.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between p-2 border rounded">
                                <span className="text-sm">{doc.name}</span>
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeDocument(index)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar - 1 column */}
                <div className="space-y-6">
                  {/* Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        onClick={saveDraft}
                        variant="outline"
                        className="w-full bg-transparent"
                        disabled={isDraft}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isDraft ? "Saving..." : "Save Draft"}
                      </Button>
                      <Button onClick={submitSeizure} className="w-full" disabled={isSubmitting}>
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Submitting..." : "Submit Seizure"}
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" onClick={() => router.back()}>
                        Cancel
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Chain of Custody */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Chain of Custody</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="storageAssignment">Storage Assignment</Label>
                        <Select
                          value={seizureData.storageAssignment}
                          onValueChange={(value) => handleInputChange("storageAssignment", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select storage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                            <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                            <SelectItem value="evidence-room">Evidence Room</SelectItem>
                            <SelectItem value="pending">Pending Assignment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Alert>
                        <AlertDescription className="text-xs">
                          Once submitted, core fields will require supervisor approval to modify.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  {/* Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <strong>Type:</strong> {seizureData.contrabandType || "Not selected"}
                      </div>
                      <div>
                        <strong>Quantity:</strong> {seizureData.quantity} {seizureData.unit}
                      </div>
                      <div>
                        <strong>Photos:</strong> {seizureData.photos.length}
                      </div>
                      <div>
                        <strong>Documents:</strong> {seizureData.documents.length}
                      </div>
                      <div>
                        <strong>GPS:</strong>{" "}
                        {seizureData.location.lat && seizureData.location.lon ? "Captured" : "Not captured"}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
