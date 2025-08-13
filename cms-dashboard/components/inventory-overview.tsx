"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  MapPin,
  Package,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Scan,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import Link from "next/link"
import { apiGet } from "@/lib/api"

interface StorageLocation {
  id: string
  name: string
  address: string
  type: "Warehouse" | "Evidence Room" | "Temporary" | "Secure Vault"
  capacity: number
  currentItems: number
  status: "Active" | "Maintenance" | "Full" | "Inactive"
  lastAudit: string
  manager: string
  contact: string
}

interface InventoryItem {
  id: string
  contrabandCode: string
  type: string
  location: string
  status: "Present" | "Missing" | "Discrepancy" | "In Transit"
  lastSeen: string
  assignedDate: string
}

const statusColors = {
  Active: "bg-green-500",
  Maintenance: "bg-yellow-500",
  Full: "bg-red-500",
  Inactive: "bg-gray-500",
}

const itemStatusColors = {
  Present: "bg-green-500",
  Missing: "bg-red-500",
  Discrepancy: "bg-yellow-500",
  "In Transit": "bg-blue-500",
}

interface InventoryOverviewProps {
  userRole: string
}

export function InventoryOverview({ userRole }: InventoryOverviewProps) {
  const [locations, setLocations] = useState<StorageLocation[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [locs, items] = await Promise.all([
          apiGet<StorageLocation[]>("/inventory/locations"),
          apiGet<InventoryItem[]>("/inventory/items"),
        ])
        setLocations(locs)
        setInventoryItems(items)
      } catch (e: any) {
        setError(e?.message || "Failed to load inventory data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalCapacity = locations.reduce((sum, loc) => sum + loc.capacity, 0)
  const totalItems = locations.reduce((sum, loc) => sum + loc.currentItems, 0)
  const utilizationRate = (totalItems / totalCapacity) * 100

  const activeLocations = locations.filter((loc) => loc.status === "Active").length
  const missingItems = inventoryItems.filter((item) => item.status === "Missing").length
  const discrepancyItems = inventoryItems.filter((item) => item.status === "Discrepancy").length

  return (
    <div className="space-y-6">
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-destructive">{error}</div>
          </CardContent>
        </Card>
      )}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </CardContent>
        </Card>
      )}
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{activeLocations} active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Utilization</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationRate.toFixed(1)}%</div>
            <Progress value={utilizationRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {totalItems} of {totalCapacity} capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{missingItems}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                locations.filter((loc) => new Date(loc.lastAudit) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Audited this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="locations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="locations">Storage Locations</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Storage Locations ({locations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Audit</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locations.map((location) => {
                    const utilization = (location.currentItems / location.capacity) * 100
                    return (
                      <TableRow key={location.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-muted-foreground">{location.address}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{location.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {location.currentItems} / {location.capacity}
                            </div>
                            <Progress value={utilization} className="mt-1 w-16" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{utilization.toFixed(1)}%</span>
                            {utilization > 90 ? (
                              <TrendingUp className="h-4 w-4 text-red-500" />
                            ) : utilization > 70 ? (
                              <TrendingUp className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[location.status]} text-white`}>{location.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(location.lastAudit).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{location.manager}</div>
                            <div className="text-muted-foreground">{location.contact}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Link href={`/inventory/locations/${location.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {(userRole === "Admin" || userRole === "Warehouse Manager") && (
                              <>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Link href={`/inventory/locations/${location.id}/audit`}>
                                  <Button variant="ghost" size="sm">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Inventory Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contraband Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-mono text-sm">{item.contrabandCode}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.type}</Badge>
                      </TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <Badge className={`${itemStatusColors[item.status]} text-white`}>{item.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(item.lastSeen).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Link href={`/seizures/${item.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {(userRole === "Warehouse Manager" || userRole === "Admin") && (
                            <Button variant="ghost" size="sm">
                              <Scan className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Storage Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Month</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">+12% capacity</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Items Added</span>
                    <span className="text-sm font-medium">156 items</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Items Removed</span>
                    <span className="text-sm font-medium">89 items</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed Audits</span>
                    <span className="text-sm font-medium">8 this month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Discrepancies Found</span>
                    <span className="text-sm font-medium text-yellow-600">{discrepancyItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resolution Rate</span>
                    <span className="text-sm font-medium text-green-600">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
