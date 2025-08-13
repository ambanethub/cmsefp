"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Edit,
  Printer,
  Download,
  Flag,
  Package,
  Trash2,
  MapPin,
  Calendar,
  User,
  Camera,
  FileText,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"

// Mock seizure data - in real app, this would be fetched from API
const mockSeizure = {
  id: "1",
  contrabandCode: "CMS-001234",
  type: "Drugs",
  category: "Cocaine",
  description: "White crystalline powder, suspected cocaine",
  quantity: 2.5,
  unit: "kg",
  serialNumber: "N/A",
  status: "In Storage",
  seizureTime: "2024-01-15T08:30:00",
  seizureLocation: {
    address: "Bole International Airport, Terminal 2",
    coordinates: { lat: 8.9806, lon: 38.7992 },
  },
  locationType: "Airport",
  seizedBy: "Officer Meron Bekele",
  agency: "Ethiopian Federal Police",
  assignedStorage: "Warehouse A - Section B2",
  notes: "Found hidden in false bottom of suitcase during routine customs inspection. Passenger claimed no knowledge.",
  photos: ["/cocaine-evidence.png", "/suitcase-false-bottom.png", "/airport-seizure.png"],
  documents: [
    { name: "Seizure Report.pdf", size: "2.3 MB", type: "pdf" },
    { name: "Lab Analysis Request.docx", size: "156 KB", type: "docx" },
  ],
  custodyHistory: [
    {
      id: "1",
      action: "Seizure Registered",
      actor: "Officer Meron Bekele",
      timestamp: "2024-01-15T08:30:00",
      location: "Bole Airport",
      notes: "Initial seizure and registration",
    },
    {
      id: "2",
      action: "Transfer Approved",
      actor: "Supervisor Alemayehu Tadesse",
      timestamp: "2024-01-15T09:15:00",
      location: "Bole Airport",
      notes: "Approved transfer to central warehouse",
    },
    {
      id: "3",
      action: "Received at Storage",
      actor: "Warehouse Manager Dawit Haile",
      timestamp: "2024-01-15T11:30:00",
      location: "Warehouse A",
      notes: "Item received and stored in Section B2",
    },
  ],
  integrityHash: "sha256:a1b2c3d4e5f6...",
  verificationStatus: "Verified",
  caseNumber: "CASE-2024-0156",
  relatedCases: ["CASE-2024-0155", "CASE-2024-0157"],
}

export default function SeizureDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [currentPath] = useState(`/seizures/${params.id}`)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const canEdit = user.role === "Admin" || (user.role === "Supervisor" && mockSeizure.status === "Pending")

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <DashboardHeader userRole={user.role} userName={user.name} notificationCount={7} />

        <div className="flex h-[calc(100vh-4rem)]">
          <DashboardSidebar userRole={user.role} currentPath={currentPath} />

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Contraband #{mockSeizure.contrabandCode}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className="bg-green-500 text-white">{mockSeizure.status}</Badge>
                    <span className="text-muted-foreground">Case: {mockSeizure.caseNumber}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Label
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Evidence Packet
                  </Button>
                  <Button variant="outline" size="sm">
                    <Flag className="h-4 w-4 mr-2" />
                    Flag
                  </Button>
                  {canEdit && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <Button>
                      <Package className="h-4 w-4 mr-2" />
                      Initiate Transfer
                    </Button>
                    <Button variant="outline">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Request Destruction
                    </Button>
                    <Button variant="outline">
                      <Printer className="h-4 w-4 mr-2" />
                      Generate Barcode
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Main Content */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Summary Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Type & Category</label>
                            <p className="text-lg font-medium">
                              {mockSeizure.type} - {mockSeizure.category}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Quantity</label>
                            <p className="text-lg font-medium">
                              {mockSeizure.quantity} {mockSeizure.unit}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Serial Number</label>
                            <p className="text-lg font-medium">{mockSeizure.serialNumber}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Seized By</label>
                            <p className="text-lg font-medium flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              {mockSeizure.seizedBy}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Seizure Time</label>
                            <p className="text-lg font-medium flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(mockSeizure.seizureTime).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Location</label>
                            <p className="text-lg font-medium flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {mockSeizure.seizureLocation.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tabs for detailed information */}
                  <Tabs defaultValue="photos" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="photos">Photos</TabsTrigger>
                      <TabsTrigger value="custody">Custody Timeline</TabsTrigger>
                      <TabsTrigger value="storage">Storage & Inventory</TabsTrigger>
                      <TabsTrigger value="audit">Audit & Integrity</TabsTrigger>
                    </TabsList>

                    <TabsContent value="photos" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Evidence Photos ({mockSeizure.photos.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {mockSeizure.photos.map((photo, index) => (
                              <div
                                key={index}
                                className="relative cursor-pointer group"
                                onClick={() => setSelectedPhoto(photo)}
                              >
                                <Image
                                  src={photo || "/placeholder.svg"}
                                  alt={`Evidence photo ${index + 1}`}
                                  width={200}
                                  height={150}
                                  className="w-full h-32 object-cover rounded-lg border group-hover:opacity-80 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Camera className="h-8 w-8 text-white" />
                                </div>
                              </div>
                            ))}
                          </div>
                          <Separator className="my-4" />
                          <div className="space-y-2">
                            <h4 className="font-medium">Documents</h4>
                            {mockSeizure.documents.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">{doc.name}</p>
                                    <p className="text-sm text-muted-foreground">{doc.size}</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="custody" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Chain of Custody</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {mockSeizure.custodyHistory.map((event, index) => (
                              <div key={event.id} className="flex items-start space-x-4">
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    {index === 0 ? (
                                      <Shield className="h-4 w-4 text-primary" />
                                    ) : index === mockSeizure.custodyHistory.length - 1 ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Clock className="h-4 w-4 text-blue-500" />
                                    )}
                                  </div>
                                  {index < mockSeizure.custodyHistory.length - 1 && (
                                    <div className="w-px h-8 bg-border mt-2" />
                                  )}
                                </div>
                                <div className="flex-1 pb-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{event.action}</h4>
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(event.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    By {event.actor} at {event.location}
                                  </p>
                                  <p className="text-sm mt-2">{event.notes}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="storage" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Storage Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Current Location</label>
                              <p className="text-lg font-medium flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                {mockSeizure.assignedStorage}
                              </p>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                              <Button variant="outline">
                                <MapPin className="h-4 w-4 mr-2" />
                                Navigate to Location
                              </Button>
                              <Button variant="outline">
                                <Printer className="h-4 w-4 mr-2" />
                                Print Storage Label
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="audit" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Audit & Integrity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h4 className="font-medium">Integrity Status</h4>
                                <p className="text-sm text-muted-foreground">Chain verification status</p>
                              </div>
                              <Badge className="bg-green-500 text-white flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {mockSeizure.verificationStatus}
                              </Badge>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Hash</label>
                              <p className="font-mono text-sm bg-muted p-2 rounded">{mockSeizure.integrityHash}</p>
                            </div>
                            <Button variant="outline" className="w-full bg-transparent">
                              <Shield className="h-4 w-4 mr-2" />
                              Verify Integrity
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                  {/* Notes & Comments */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Notes & Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm">{mockSeizure.notes}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">Initial seizure note</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(mockSeizure.seizureTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full bg-transparent">
                          Add Note
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Related Cases */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Related Cases</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {mockSeizure.relatedCases.map((caseId) => (
                          <div key={caseId} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm font-mono">{caseId}</span>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle>System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Record Status</span>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Last Updated</span>
                          <span className="text-sm text-muted-foreground">2 hours ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Access Level</span>
                          <Badge variant="outline">Standard</Badge>
                        </div>
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
