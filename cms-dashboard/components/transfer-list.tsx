"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Package,
  User,
  MapPin,
  Calendar,
  MoreHorizontal,
  FileText,
  Truck,
} from "lucide-react"
import Link from "next/link"
import { apiGet } from "@/lib/api"

interface Transfer {
  id: string
  contrabandCode: string
  contrabandType: string
  fromLocation: string
  toLocation: string
  requestedBy: string
  requestedAt: string
  approvedBy?: string
  approvedAt?: string
  receivedBy?: string
  receivedAt?: string
  status: "Pending" | "Approved" | "In Transit" | "Completed" | "Rejected"
  reason: string
  urgency: "Normal" | "Urgent"
  notes?: string
}

const statusColors = {
  Pending: "bg-yellow-500",
  Approved: "bg-green-500",
  "In Transit": "bg-blue-500",
  Completed: "bg-gray-500",
  Rejected: "bg-red-500",
}

const urgencyColors = {
  Normal: "bg-gray-500",
  Urgent: "bg-red-500",
}

interface TransferListProps {
  userRole: string
}

export function TransferList({ userRole }: TransferListProps) {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await apiGet<Transfer[]>("/transfers")
        setTransfers(data)
      } catch (e: any) {
        setError(e?.message || "Failed to load transfers")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch =
      transfer.contrabandCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.contrabandType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.toLocation.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transfer.status === statusFilter
    const matchesUrgency = urgencyFilter === "all" || transfer.urgency === urgencyFilter

    return matchesSearch && matchesStatus && matchesUrgency
  })

  const pendingTransfers = filteredTransfers.filter((t) => t.status === "Pending")
  const approvedTransfers = filteredTransfers.filter((t) => t.status === "Approved")
  const inTransitTransfers = filteredTransfers.filter((t) => t.status === "In Transit")
  const completedTransfers = filteredTransfers.filter((t) => t.status === "Completed")

  const canApprove = userRole === "Supervisor" || userRole === "Admin"
  const canReceive = userRole === "Warehouse Manager" || userRole === "Admin"

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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({filteredTransfers.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingTransfers.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedTransfers.length})</TabsTrigger>
          <TabsTrigger value="transit">In Transit ({inTransitTransfers.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTransfers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <TransferTable
            transfers={filteredTransfers}
            userRole={userRole}
            canApprove={canApprove}
            canReceive={canReceive}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <TransferTable
            transfers={pendingTransfers}
            userRole={userRole}
            canApprove={canApprove}
            canReceive={canReceive}
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <TransferTable
            transfers={approvedTransfers}
            userRole={userRole}
            canApprove={canApprove}
            canReceive={canReceive}
          />
        </TabsContent>

        <TabsContent value="transit" className="space-y-4">
          <TransferTable
            transfers={inTransitTransfers}
            userRole={userRole}
            canApprove={canApprove}
            canReceive={canReceive}
          />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <TransferTable
            transfers={completedTransfers}
            userRole={userRole}
            canApprove={canApprove}
            canReceive={canReceive}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface TransferTableProps {
  transfers: Transfer[]
  userRole: string
  canApprove: boolean
  canReceive: boolean
}

function TransferTable({ transfers, userRole, canApprove, canReceive }: TransferTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfers ({transfers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Transfer Route</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-mono text-sm">{transfer.contrabandCode}</div>
                      <div className="text-sm text-muted-foreground">{transfer.contrabandType}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="font-medium">From:</span> {transfer.fromLocation}
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="font-medium">To:</span> {transfer.toLocation}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <User className="h-3 w-3 mr-1" />
                    {transfer.requestedBy}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${statusColors[transfer.status]} text-white`}>{transfer.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${urgencyColors[transfer.urgency]} text-white`}>{transfer.urgency}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(transfer.requestedAt).toLocaleDateString()}
                  </div>
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
                        <Link href={`/transfers/${transfer.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      {canApprove && transfer.status === "Pending" && (
                        <>
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      {canReceive && transfer.status === "Approved" && (
                        <DropdownMenuItem>
                          <Truck className="h-4 w-4 mr-2" />
                          Acknowledge Receipt
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
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
  )
}
