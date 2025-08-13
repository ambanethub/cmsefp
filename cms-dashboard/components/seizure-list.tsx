"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  ArrowUpDown,
  MoreHorizontal,
  Package,
  Calendar,
  MapPin,
  User,
  Printer,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { apiGet } from "@/lib/api"

interface SeizureItem {
  id: string
  contrabandCode: string
  type: string
  category: string
  quantity: number
  unit: string
  status: "Registered" | "In Storage" | "In Transit" | "Destroyed" | "Pending"
  seizureTime: string
  seizedBy: string
  location: string
  assignedStorage: string
  photos: number
  hasDocuments: boolean
}

const initialSeizures: SeizureItem[] = []

const statusColors = {
  Registered: "bg-blue-500",
  "In Storage": "bg-green-500",
  "In Transit": "bg-yellow-500",
  Destroyed: "bg-red-500",
  Pending: "bg-orange-500",
}

interface SeizureListProps {
  userRole: string
}

export function SeizureList({ userRole }: SeizureListProps) {
  const [seizures, setSeizures] = useState<SeizureItem[]>(initialSeizures)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [sortField, setSortField] = useState<string>("seizureTime")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await apiGet<SeizureItem[]>("/seizures")
        setSeizures(data)
      } catch (e: any) {
        setError(e?.message || "Failed to load seizures")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredSeizures = seizures.filter((seizure) => {
    const matchesSearch =
      seizure.contrabandCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seizure.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seizure.seizedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seizure.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || seizure.status === statusFilter
    const matchesType = typeFilter === "all" || seizure.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const sortedSeizures = [...filteredSeizures].sort((a, b) => {
    const aValue = a[sortField as keyof SeizureItem]
    const bValue = b[sortField as keyof SeizureItem]

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(sortedSeizures.map((s) => s.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    }
  }

  const canEdit = (status: string) => {
    return userRole === "Admin" || (userRole === "Supervisor" && status === "Pending")
  }

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
      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by code, type, officer, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Registered">Registered</SelectItem>
                  <SelectItem value="In Storage">In Storage</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Destroyed">Destroyed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Drugs">Drugs</SelectItem>
                  <SelectItem value="Weapons">Weapons</SelectItem>
                  <SelectItem value="Counterfeit Currency">Counterfeit Currency</SelectItem>
                  <SelectItem value="Stolen Goods">Stolen Goods</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{selectedItems.length} items selected</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Bulk Transfer
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Bulk Export
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Generate Labels
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seizures Table */}
      <Card>
        <CardHeader>
          <CardTitle>Seizures ({sortedSeizures.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === sortedSeizures.length && sortedSeizures.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("contrabandCode")}
                    className="h-auto p-0 font-medium"
                  >
                    Code
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort("seizureTime")} className="h-auto p-0 font-medium">
                    Seized
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSeizures.map((seizure) => (
                <TableRow key={seizure.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(seizure.id)}
                      onCheckedChange={(checked) => handleSelectItem(seizure.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{seizure.contrabandCode}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{seizure.type}</div>
                        <div className="text-sm text-muted-foreground">{seizure.category}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          {seizure.photos > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {seizure.photos} photos
                            </Badge>
                          )}
                          {seizure.hasDocuments && (
                            <Badge variant="outline" className="text-xs">
                              <FileText className="h-3 w-3 mr-1" />
                              Docs
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {seizure.quantity} {seizure.unit}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[seizure.status]} text-white`}>{seizure.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(seizure.seizureTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        {seizure.seizedBy}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      {seizure.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{seizure.assignedStorage}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/seizures/${seizure.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {canEdit(seizure.status) && (
                          <DropdownMenuItem asChild>
                            <Link href={`/seizures/${seizure.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Package className="h-4 w-4 mr-2" />
                          Initiate Transfer
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="h-4 w-4 mr-2" />
                          Generate Barcode
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Export Evidence
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
