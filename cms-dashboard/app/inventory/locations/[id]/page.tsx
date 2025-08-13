"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  MapPin,
  Package,
  User,
  Phone,
  Calendar,
  FileText,
  Scan,
  Download,
  Edit,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react"
import { useParams } from "next/navigation"
import Link from "next/link"

// Mock location data
const mockLocation = {
  id: "1",
  name: "Warehouse A",
  address: "Industrial Zone, Block 15, Addis Ababa",
  type: "Warehouse",
  capacity: 1000,
  currentItems: 847,
  status: "Active",
  lastAudit: "2024-01-10T14:30:00",
  manager: "Dawit Haile",
  contact: "+251911234567",
  description: "Primary storage facility for seized contraband items. Climate controlled with 24/7 security.",
  sections: [
    { id: "A1", name: "Section A1", capacity: 200, items: 156, type: "General Storage" },
    { id: "A2", name: "Section A2", capacity: 200, items: 189, type: "General Storage" },
    { id: "B1", name: "Section B1", capacity: 150, items: 134, type: "High Security" },
    { id: "B2", name: "Section B2", capacity: 150, items: 142, type: "High Security" },
    { id: "C1", name: "Section C1", capacity: 300, items: 226, type: "Bulk Storage" },
  ],
}

const mockInventoryItems = [
  {
    id: "1",
    contrabandCode: "CMS-001234",
    type: "Drugs",
    category: "Cocaine",
    quantity: "2.5 kg",
    section: "B2",
    status: "Present",
    assignedDate: "2024-01-15",
    lastSeen: "2024-01-15T10:30:00",
  },
  {
    id: "2",
    contrabandCode: "CMS-001236",
    type: "Currency",
    category: "USD",
    quantity: "50,000 units",
    section: "B1",
    status: "Present",
    assignedDate: "2024-01-14",
    lastSeen: "2024-01-15T09:15:00",
  },
  {
    id: "3",
    contrabandCode: "CMS-001238",
    type: "Weapons",
    category: "Firearms",
    quantity: "3 pieces",
    section: "B1",
    status: "Present",
    assignedDate: "2024-01-13",
    lastSeen: "2024-01-14T16:45:00",
  },
]

const mockAuditHistory = [
  {
    id: "1",
    date: "2024-01-10",
    auditor: "Sara Tekle",
    itemsChecked: 847,
    discrepancies: 2,
    status: "Completed",
    notes: "Minor discrepancies in Section A2 resolved",
  },
  {
    id: "2",
    date: "2024-01-03",
    auditor: "Yohannes Kebede",
    itemsChecked: 823,
    discrepancies: 0,
    status: "Completed",
    notes: "All items accounted for",
  },
]

export default function LocationDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const [currentPath] = useState(`/inventory/locations/${params.id}`)

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const utilizationRate = (mockLocation.currentItems / mockLocation.capacity) * 100

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
                  <h1 className="text-3xl font-bold text-foreground">{mockLocation.name}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className="bg-green-500 text-white">{mockLocation.status}</Badge>
                    <span className="text-muted-foreground flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {mockLocation.address}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href={`/inventory/locations/${params.id}/audit`}>
                    <Button>
                      <FileText className="h-4 w-4 mr-2" />
                      Start Audit
                    </Button>
                  </Link>
                  <Link href={`/inventory/scan?location=${params.id}`}>
                    <Button variant="outline">
                      <Scan className="h-4 w-4 mr-2" />
                      Scan Items
                    </Button>
                  </Link>
                  {user.role === "Admin" && (
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Location
                    </Button>
                  )}
                </div>
              </div>

              {/* Overview Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Capacity</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {mockLocation.currentItems} / {mockLocation.capacity}
                    </div>
                    <Progress value={utilizationRate} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">{utilizationRate.toFixed(1)}% utilized</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Manager</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">{mockLocation.manager}</div>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      {mockLocation.contact}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Last Audit</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">{new Date(mockLocation.lastAudit).toLocaleDateString()}</div>
                    <p className="text-xs text-muted-foreground">
                      {Math.floor((Date.now() - new Date(mockLocation.lastAudit).getTime()) / (1000 * 60 * 60 * 24))}{" "}
                      days ago
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sections</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockLocation.sections.length}</div>
                    <p className="text-xs text-muted-foreground">Storage sections</p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <Tabs defaultValue="inventory" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="sections">Sections</TabsTrigger>
                  <TabsTrigger value="audit">Audit History</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="inventory" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Inventory ({mockInventoryItems.length} items)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Seen</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockInventoryItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Link href={`/seizures/${item.id}`} className="font-mono text-sm hover:underline">
                                  {item.contrabandCode}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.type}</Badge>
                              </TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell className="font-medium">{item.quantity}</TableCell>
                              <TableCell>{item.section}</TableCell>
                              <TableCell>
                                <Badge className="bg-green-500 text-white flex items-center w-fit">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {item.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(item.lastSeen).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sections" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Storage Sections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {mockLocation.sections.map((section) => {
                          const sectionUtilization = (section.items / section.capacity) * 100
                          return (
                            <Card key={section.id}>
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg">{section.name}</CardTitle>
                                  <Badge variant="outline">{section.type}</Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span>Capacity</span>
                                      <span>
                                        {section.items} / {section.capacity}
                                      </span>
                                    </div>
                                    <Progress value={sectionUtilization} className="mt-1" />
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span>Utilization</span>
                                    <span className="font-medium">{sectionUtilization.toFixed(1)}%</span>
                                  </div>
                                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                                    <Package className="h-4 w-4 mr-2" />
                                    View Items
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="audit" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Audit History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Auditor</TableHead>
                            <TableHead>Items Checked</TableHead>
                            <TableHead>Discrepancies</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockAuditHistory.map((audit) => (
                            <TableRow key={audit.id}>
                              <TableCell>{new Date(audit.date).toLocaleDateString()}</TableCell>
                              <TableCell>{audit.auditor}</TableCell>
                              <TableCell>{audit.itemsChecked}</TableCell>
                              <TableCell>
                                {audit.discrepancies === 0 ? (
                                  <Badge className="bg-green-500 text-white">0</Badge>
                                ) : (
                                  <Badge className="bg-yellow-500 text-white">{audit.discrepancies}</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-green-500 text-white flex items-center w-fit">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {audit.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{audit.notes}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Location Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Name</label>
                          <p className="text-lg font-medium">{mockLocation.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Type</label>
                          <p className="text-lg font-medium">{mockLocation.type}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Address</label>
                          <p className="text-lg font-medium">{mockLocation.address}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Description</label>
                          <p className="text-sm">{mockLocation.description}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Management</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Manager</label>
                          <p className="text-lg font-medium flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {mockLocation.manager}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Contact</label>
                          <p className="text-lg font-medium flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {mockLocation.contact}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <Badge className="bg-green-500 text-white">{mockLocation.status}</Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Last Audit</label>
                          <p className="text-lg font-medium flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {new Date(mockLocation.lastAudit).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
