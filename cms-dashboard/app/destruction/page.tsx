"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, FileText, Users, AlertTriangle, CheckCircle, XCircle, Eye, Plus } from "lucide-react"

const mockDestructionRequests = [
  {
    id: "DR-2024-001",
    items: ["CNB-2024-001", "CNB-2024-003"],
    itemCount: 2,
    requestedBy: "Supervisor Ahmed",
    requestedAt: "2024-01-15T10:30:00Z",
    status: "pending_approval",
    method: "incineration",
    scheduledDate: "2024-01-25",
    reason: "Court order for destruction of seized narcotics",
    approvals: [
      { level: 1, approver: "Chief Inspector Meron", status: "approved", timestamp: "2024-01-15T14:20:00Z" },
      { level: 2, approver: "Deputy Commissioner Tadesse", status: "pending", timestamp: null },
    ],
    witnesses: ["Officer Bekele", "Legal Advisor Hanna"],
  },
  {
    id: "DR-2024-002",
    items: ["CNB-2024-005"],
    itemCount: 1,
    requestedBy: "Supervisor Tigist",
    requestedAt: "2024-01-14T09:15:00Z",
    status: "approved",
    method: "chemical_neutralization",
    scheduledDate: "2024-01-20",
    reason: "Expired chemical substances - safety hazard",
    approvals: [
      { level: 1, approver: "Chief Inspector Meron", status: "approved", timestamp: "2024-01-14T11:30:00Z" },
      { level: 2, approver: "Deputy Commissioner Tadesse", status: "approved", timestamp: "2024-01-14T16:45:00Z" },
    ],
    witnesses: ["Officer Dawit", "Environmental Officer Sara"],
  },
]

const mockContrabandItems = [
  { id: "CNB-2024-001", code: "CNB-2024-001", type: "Narcotics", description: "Cocaine powder", quantity: "2.5 kg" },
  { id: "CNB-2024-003", code: "CNB-2024-003", type: "Narcotics", description: "Heroin", quantity: "1.2 kg" },
  { id: "CNB-2024-005", code: "CNB-2024-005", type: "Chemical", description: "Precursor chemicals", quantity: "5.0 L" },
  { id: "CNB-2024-007", code: "CNB-2024-007", type: "Weapons", description: "Illegal firearms", quantity: "3 units" },
]

export default function DestructionPage() {
  const [activeTab, setActiveTab] = useState("requests")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const getStatusBadge = (status: string) => {
    const variants = {
      pending_approval: { variant: "secondary" as const, label: "Pending Approval" },
      approved: { variant: "default" as const, label: "Approved" },
      scheduled: { variant: "outline" as const, label: "Scheduled" },
      in_progress: { variant: "destructive" as const, label: "In Progress" },
      completed: { variant: "default" as const, label: "Completed" },
    }
    return variants[status as keyof typeof variants] || { variant: "secondary" as const, label: status }
  }

  const getMethodLabel = (method: string) => {
    const methods = {
      incineration: "Incineration",
      chemical_neutralization: "Chemical Neutralization",
      crushing: "Crushing/Shredding",
      burial: "Secure Burial",
      other: "Other Method",
    }
    return methods[method as keyof typeof methods] || method
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Destruction Management</h1>
          <p className="text-slate-600 mt-1">Manage contraband destruction requests and approvals</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              New Destruction Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Destruction Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Select Items for Destruction</Label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {mockContrabandItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={item.id}
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems([...selectedItems, item.id])
                          } else {
                            setSelectedItems(selectedItems.filter((id) => id !== item.id))
                          }
                        }}
                      />
                      <label htmlFor={item.id} className="text-sm flex-1 cursor-pointer">
                        <span className="font-medium">{item.code}</span> - {item.description} ({item.quantity})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="method">Destruction Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incineration">Incineration</SelectItem>
                      <SelectItem value="chemical_neutralization">Chemical Neutralization</SelectItem>
                      <SelectItem value="crushing">Crushing/Shredding</SelectItem>
                      <SelectItem value="burial">Secure Burial</SelectItem>
                      <SelectItem value="other">Other Method</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="scheduled-date">Proposed Date</Label>
                  <Input type="date" id="scheduled-date" />
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Legal Basis & Reason</Label>
                <Textarea id="reason" placeholder="Provide legal justification for destruction..." className="mt-1" />
              </div>

              <div>
                <Label>Witnesses</Label>
                <div className="mt-2 space-y-2">
                  <Input placeholder="Witness 1 (Name and Title)" />
                  <Input placeholder="Witness 2 (Name and Title)" />
                  <Button variant="outline" size="sm">
                    Add Another Witness
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline">Save Draft</Button>
                <Button className="bg-red-600 hover:bg-red-700">Submit Request</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="requests">Destruction Requests</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Destructions</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending_approval">Pending Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {mockDestructionRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{request.id}</CardTitle>
                      <p className="text-sm text-slate-600 mt-1">
                        {request.itemCount} items • Requested by {request.requestedBy}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge {...getStatusBadge(request.status)}>{getStatusBadge(request.status).label}</Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium">Scheduled Date</p>
                        <p className="text-sm text-slate-600">{new Date(request.scheduledDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium">Method</p>
                        <p className="text-sm text-slate-600">{getMethodLabel(request.method)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium">Witnesses</p>
                        <p className="text-sm text-slate-600">{request.witnesses.length} assigned</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Approval Status</p>
                    <div className="flex gap-4">
                      {request.approvals.map((approval, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {approval.status === "approved" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : approval.status === "rejected" ? (
                            <XCircle className="w-4 h-4 text-red-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-600" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{approval.approver}</p>
                            <p className="text-xs text-slate-600">
                              Level {approval.level} • {approval.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-md">
                    <p className="text-sm">
                      <strong>Reason:</strong> {request.reason}
                    </p>
                  </div>

                  {request.status === "pending_approval" && (
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Scheduled Destructions</h3>
                <p className="text-slate-600">Approved destruction requests will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Completed Destructions</h3>
                <p className="text-slate-600">Completed destruction records will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
