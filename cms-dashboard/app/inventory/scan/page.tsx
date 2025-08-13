"use client"

import { useState, useRef } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Scan, Camera, Keyboard, CheckCircle, MapPin, Clock, Download, Trash2 } from "lucide-react"

interface ScannedItem {
  id: string
  contrabandCode: string
  type: string
  status: "Found" | "Missing" | "Unexpected"
  location: string
  scannedAt: string
  notes?: string
}

const mockScannedItems: ScannedItem[] = [
  {
    id: "1",
    contrabandCode: "CMS-001234",
    type: "Drugs",
    status: "Found",
    location: "Warehouse A - B2",
    scannedAt: "2024-01-15T10:30:00",
  },
  {
    id: "2",
    contrabandCode: "CMS-001235",
    type: "Weapons",
    status: "Missing",
    location: "Evidence Room - A1",
    scannedAt: "2024-01-15T10:25:00",
    notes: "Expected but not found during scan",
  },
]

export default function ScanPage() {
  const { user } = useAuth()
  const [currentPath] = useState("/inventory/scan")
  const [scanMode, setScanMode] = useState<"barcode" | "manual">("barcode")
  const [currentLocation, setCurrentLocation] = useState("")
  const [manualCode, setManualCode] = useState("")
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>(mockScannedItems)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const startBarcodeScanning = async () => {
    setIsScanning(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Camera access failed:", error)
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
  }

  const handleManualScan = () => {
    if (manualCode.trim()) {
      processScannedCode(manualCode.trim())
      setManualCode("")
    }
  }

  const processScannedCode = (code: string) => {
    // Mock processing - in real app, this would validate against database
    const newItem: ScannedItem = {
      id: Date.now().toString(),
      contrabandCode: code,
      type: "Unknown", // Would be fetched from database
      status: Math.random() > 0.8 ? "Missing" : "Found",
      location: currentLocation || "Unknown",
      scannedAt: new Date().toISOString(),
    }

    setScannedItems([newItem, ...scannedItems])
    setScanResult(code)
    setTimeout(() => setScanResult(null), 3000)
  }

  const markItemStatus = (itemId: string, status: "Found" | "Missing" | "Unexpected") => {
    setScannedItems(scannedItems.map((item) => (item.id === itemId ? { ...item, status } : item)))
  }

  const removeItem = (itemId: string) => {
    setScannedItems(scannedItems.filter((item) => item.id !== itemId))
  }

  const exportScanResults = () => {
    const csvContent = [
      ["Contraband Code", "Type", "Status", "Location", "Scanned At", "Notes"],
      ...scannedItems.map((item) => [
        item.contrabandCode,
        item.type,
        item.status,
        item.location,
        item.scannedAt,
        item.notes || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `inventory-scan-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const statusColors = {
    Found: "bg-green-500",
    Missing: "bg-red-500",
    Unexpected: "bg-yellow-500",
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthGuard requiredRoles={["Warehouse Manager", "Admin"]}>
      <div className="min-h-screen bg-background">
        <DashboardHeader userRole={user.role} userName={user.name} notificationCount={7} />

        <div className="flex h-[calc(100vh-4rem)]">
          <DashboardSidebar userRole={user.role} currentPath={currentPath} />

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Inventory Scanning</h1>
                  <p className="text-muted-foreground">Scan barcodes to track and verify inventory items</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={exportScanResults} variant="outline" disabled={scannedItems.length === 0}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                </div>
              </div>

              {/* Scan Result Alert */}
              {scanResult && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Successfully scanned: {scanResult}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Scanning Interface - 1 column */}
                <div className="space-y-6">
                  {/* Location Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Scanning Location</Label>
                          <Select value={currentLocation} onValueChange={setCurrentLocation}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="warehouse-a-b1">Warehouse A - Section B1</SelectItem>
                              <SelectItem value="warehouse-a-b2">Warehouse A - Section B2</SelectItem>
                              <SelectItem value="evidence-room-a1">Evidence Room - Section A1</SelectItem>
                              <SelectItem value="secure-vault-c1">Secure Vault - Section C1</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {currentLocation && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>Currently scanning: {currentLocation}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Scanning Methods */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Scan Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs value={scanMode} onValueChange={(value) => setScanMode(value as "barcode" | "manual")}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="barcode">Barcode Scanner</TabsTrigger>
                          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                        </TabsList>

                        <TabsContent value="barcode" className="space-y-4">
                          <div className="space-y-4">
                            {!isScanning ? (
                              <Button onClick={startBarcodeScanning} className="w-full">
                                <Camera className="h-4 w-4 mr-2" />
                                Start Camera Scanning
                              </Button>
                            ) : (
                              <div className="space-y-4">
                                <div className="relative">
                                  <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-48 bg-black rounded-lg"
                                  />
                                  <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-2 border-t-2 border-b-2 border-primary"></div>
                                  </div>
                                </div>
                                <Button onClick={stopScanning} variant="outline" className="w-full bg-transparent">
                                  Stop Scanning
                                </Button>
                              </div>
                            )}
                            <p className="text-sm text-muted-foreground text-center">
                              Position the barcode within the scanning area
                            </p>
                          </div>
                        </TabsContent>

                        <TabsContent value="manual" className="space-y-4">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="manualCode">Contraband Code</Label>
                              <Input
                                id="manualCode"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                placeholder="Enter contraband code (e.g., CMS-001234)"
                                onKeyPress={(e) => e.key === "Enter" && handleManualScan()}
                              />
                            </div>
                            <Button onClick={handleManualScan} className="w-full" disabled={!manualCode.trim()}>
                              <Keyboard className="h-4 w-4 mr-2" />
                              Add Item
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  {/* Scan Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Session Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Items Scanned</span>
                          <Badge variant="outline">{scannedItems.length}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Found</span>
                          <Badge className="bg-green-500 text-white">
                            {scannedItems.filter((item) => item.status === "Found").length}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Missing</span>
                          <Badge className="bg-red-500 text-white">
                            {scannedItems.filter((item) => item.status === "Missing").length}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Unexpected</span>
                          <Badge className="bg-yellow-500 text-white">
                            {scannedItems.filter((item) => item.status === "Unexpected").length}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Scanned Items List - 2 columns */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Scanned Items ({scannedItems.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {scannedItems.length === 0 ? (
                        <div className="text-center py-8">
                          <Scan className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No items scanned yet</p>
                          <p className="text-sm text-muted-foreground">Start scanning to see items appear here</p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Code</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Scanned At</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {scannedItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <div className="font-mono text-sm">{item.contrabandCode}</div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{item.type}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={`${statusColors[item.status]} text-white`}>{item.status}</Badge>
                                </TableCell>
                                <TableCell className="text-sm">{item.location}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{new Date(item.scannedAt).toLocaleTimeString()}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Select
                                      value={item.status}
                                      onValueChange={(value) =>
                                        markItemStatus(item.id, value as "Found" | "Missing" | "Unexpected")
                                      }
                                    >
                                      <SelectTrigger className="w-32">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Found">Found</SelectItem>
                                        <SelectItem value="Missing">Missing</SelectItem>
                                        <SelectItem value="Unexpected">Unexpected</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
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
