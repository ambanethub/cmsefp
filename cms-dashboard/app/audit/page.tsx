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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Shield,
  Download,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  FileText,
  Eye,
  Flag,
  Hash,
} from "lucide-react"

const mockAuditLogs = [
  {
    id: "AUDIT-001",
    timestamp: "2024-01-15T14:30:00Z",
    actor: "Officer Bekele",
    actorRole: "Field Officer",
    action: "CREATE_SEIZURE",
    entityType: "contraband_item",
    entityId: "CNB-2024-001",
    description: "Created new seizure record for cocaine",
    ipAddress: "192.168.1.100",
    location: "Addis Ababa, Ethiopia",
    hash: "a1b2c3d4e5f6789012345678901234567890abcdef",
    verified: true,
    flagged: false,
    metadata: {
      quantity: "2.5 kg",
      type: "Narcotics",
      seizureLocation: "Bole International Airport",
    },
  },
  {
    id: "AUDIT-002",
    timestamp: "2024-01-15T14:25:00Z",
    actor: "Supervisor Ahmed",
    actorRole: "Supervisor",
    action: "APPROVE_TRANSFER",
    entityType: "custody_transfer",
    entityId: "CT-2024-001",
    description: "Approved transfer request for CNB-2024-001",
    ipAddress: "192.168.1.101",
    location: "Addis Ababa, Ethiopia",
    hash: "b2c3d4e5f6789012345678901234567890abcdef1",
    verified: true,
    flagged: false,
    metadata: {
      fromLocation: "Field Storage",
      toLocation: "Warehouse A",
      reason: "Secure storage required",
    },
  },
  {
    id: "AUDIT-003",
    timestamp: "2024-01-15T13:45:00Z",
    actor: "Unknown User",
    actorRole: "Unknown",
    action: "FAILED_LOGIN",
    entityType: "authentication",
    entityId: "AUTH-FAIL-001",
    description: "Failed login attempt - invalid credentials",
    ipAddress: "203.0.113.45",
    location: "Unknown",
    hash: "c3d4e5f6789012345678901234567890abcdef12",
    verified: true,
    flagged: true,
    metadata: {
      username: "admin",
      attempts: 5,
      blocked: true,
    },
  },
  {
    id: "AUDIT-004",
    timestamp: "2024-01-15T12:30:00Z",
    actor: "Warehouse Manager Tigist",
    actorRole: "Warehouse Manager",
    action: "INVENTORY_DISCREPANCY",
    entityType: "inventory_audit",
    entityId: "INV-AUDIT-001",
    description: "Inventory discrepancy detected - 2 items missing",
    ipAddress: "192.168.1.102",
    location: "Warehouse A",
    hash: "d4e5f6789012345678901234567890abcdef123",
    verified: true,
    flagged: true,
    metadata: {
      expectedCount: 25,
      actualCount: 23,
      missingItems: ["CNB-2024-005", "CNB-2024-006"],
    },
  },
]

const mockReports = [
  {
    id: "RPT-001",
    name: "Daily Seizures Report",
    description: "Summary of all seizures in the last 24 hours",
    type: "daily_seizures",
    lastGenerated: "2024-01-15T08:00:00Z",
    schedule: "Daily at 8:00 AM",
    recipients: ["supervisor@police.gov.et", "admin@police.gov.et"],
  },
  {
    id: "RPT-002",
    name: "Pending Transfers Report",
    description: "All pending custody transfer requests",
    type: "pending_transfers",
    lastGenerated: "2024-01-15T12:00:00Z",
    schedule: "Twice daily",
    recipients: ["warehouse@police.gov.et"],
  },
  {
    id: "RPT-003",
    name: "Audit Exceptions Report",
    description: "Flagged audit events requiring attention",
    type: "audit_exceptions",
    lastGenerated: "2024-01-15T14:00:00Z",
    schedule: "Hourly",
    recipients: ["security@police.gov.et", "admin@police.gov.et"],
  },
]

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState("logs")
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [flaggedOnly, setFlaggedOnly] = useState(false)
  const [selectedLog, setSelectedLog] = useState<string | null>(null)

  const getActionBadge = (action: string) => {
    const variants = {
      CREATE_SEIZURE: { variant: "default" as const, label: "Create Seizure" },
      APPROVE_TRANSFER: { variant: "secondary" as const, label: "Approve Transfer" },
      FAILED_LOGIN: { variant: "destructive" as const, label: "Failed Login" },
      INVENTORY_DISCREPANCY: { variant: "destructive" as const, label: "Inventory Issue" },
      DELETE_ITEM: { variant: "destructive" as const, label: "Delete Item" },
      EXPORT_DATA: { variant: "outline" as const, label: "Export Data" },
    }
    return variants[action as keyof typeof variants] || { variant: "outline" as const, label: action }
  }

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    const matchesFlagged = !flaggedOnly || log.flagged

    return matchesSearch && matchesAction && matchesFlagged
  })

  const selectedLogData = mockAuditLogs.find((log) => log.id === selectedLog)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Audit & Reporting</h1>
          <p className="text-slate-600 mt-1">Monitor system activity and generate compliance reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate Custom Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seizures">Seizures Summary</SelectItem>
                      <SelectItem value="transfers">Transfer Activity</SelectItem>
                      <SelectItem value="inventory">Inventory Status</SelectItem>
                      <SelectItem value="audit">Audit Trail</SelectItem>
                      <SelectItem value="destruction">Destruction Records</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input type="date" />
                  </div>
                </div>

                <div>
                  <Label>Filters</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-flagged" />
                      <Label htmlFor="include-flagged">Include flagged events only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-metadata" />
                      <Label htmlFor="include-metadata">Include detailed metadata</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Output Format</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                      <SelectItem value="csv">CSV Export</SelectItem>
                      <SelectItem value="json">JSON Data</SelectItem>
                      <SelectItem value="evidence">Evidence Package (ZIP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Save Template</Button>
                  <Button>Generate Report</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="integrity">Data Integrity</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="CREATE_SEIZURE">Create Seizure</SelectItem>
                <SelectItem value="APPROVE_TRANSFER">Approve Transfer</SelectItem>
                <SelectItem value="FAILED_LOGIN">Failed Login</SelectItem>
                <SelectItem value="INVENTORY_DISCREPANCY">Inventory Issues</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox id="flagged-only" checked={flaggedOnly} onCheckedChange={setFlaggedOnly} />
              <Label htmlFor="flagged-only">Flagged only</Label>
            </div>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-1" />
              More Filters
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredLogs.map((log) => (
              <Card key={log.id} className={log.flagged ? "border-red-200 bg-red-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge {...getActionBadge(log.action)}>{getActionBadge(log.action).label}</Badge>
                        {log.flagged && (
                          <Badge variant="destructive">
                            <Flag className="w-3 h-3 mr-1" />
                            Flagged
                          </Badge>
                        )}
                        {log.verified ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>

                      <p className="font-medium text-slate-900 mb-1">{log.description}</p>

                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>
                            {log.actor} ({log.actorRole})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Hash className="w-4 h-4" />
                          <span className="font-mono text-xs">{log.hash.substring(0, 8)}...</span>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-slate-600">
                        <span className="font-medium">Entity:</span> {log.entityType} ({log.entityId})
                        <span className="ml-4 font-medium">IP:</span> {log.ipAddress}
                        <span className="ml-4 font-medium">Location:</span> {log.location}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Audit Log Details - {log.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="font-medium">Timestamp</Label>
                                <p className="text-sm">{new Date(log.timestamp).toLocaleString()}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Actor</Label>
                                <p className="text-sm">
                                  {log.actor} ({log.actorRole})
                                </p>
                              </div>
                              <div>
                                <Label className="font-medium">Action</Label>
                                <p className="text-sm">{log.action}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Entity</Label>
                                <p className="text-sm">
                                  {log.entityType} ({log.entityId})
                                </p>
                              </div>
                              <div>
                                <Label className="font-medium">IP Address</Label>
                                <p className="text-sm font-mono">{log.ipAddress}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Location</Label>
                                <p className="text-sm">{log.location}</p>
                              </div>
                            </div>

                            <div>
                              <Label className="font-medium">Hash Verification</Label>
                              <div className="mt-1 p-3 bg-slate-50 rounded-md">
                                <p className="text-sm font-mono">{log.hash}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  {log.verified ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span className="text-sm text-green-600">Hash verified</span>
                                    </>
                                  ) : (
                                    <>
                                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                      <span className="text-sm text-yellow-600">Verification pending</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label className="font-medium">Metadata</Label>
                              <div className="mt-1 p-3 bg-slate-50 rounded-md">
                                <pre className="text-sm">{JSON.stringify(log.metadata, null, 2)}</pre>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {log.flagged && (
                        <Button variant="outline" size="sm">
                          <Flag className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4">
            {mockReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{report.name}</CardTitle>
                      <p className="text-sm text-slate-600 mt-1">{report.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Last
                      </Button>
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Generate Now
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Last Generated</p>
                      <p className="text-sm text-slate-600">{new Date(report.lastGenerated).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Schedule</p>
                      <p className="text-sm text-slate-600">{report.schedule}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Recipients</p>
                      <p className="text-sm text-slate-600">{report.recipients.length} recipients</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integrity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Data Integrity Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Hash Chain Verified</h3>
                  <p className="text-sm text-slate-600 mt-1">All audit logs verified</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Hash className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Blockchain Anchored</h3>
                  <p className="text-sm text-slate-600 mt-1">Last anchor: 2 hours ago</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Backup Status</h3>
                  <p className="text-sm text-slate-600 mt-1">Last backup: 6 hours ago</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-slate-900">System Health</h4>
                    <p className="text-sm text-slate-600">All integrity checks passed</p>
                  </div>
                  <Button variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Run Integrity Check
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
