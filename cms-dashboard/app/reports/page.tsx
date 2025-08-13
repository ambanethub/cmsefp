"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Download,
  Calendar,
  Users,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Settings,
} from "lucide-react"

const mockReportTemplates = [
  {
    id: "TPL-001",
    name: "Daily Seizures Summary",
    description: "Comprehensive daily report of all seizure activities",
    category: "operational",
    frequency: "daily",
    lastRun: "2024-01-15T08:00:00Z",
    nextRun: "2024-01-16T08:00:00Z",
    recipients: 3,
    status: "active",
  },
  {
    id: "TPL-002",
    name: "Weekly Inventory Audit",
    description: "Weekly inventory status and discrepancy report",
    category: "compliance",
    frequency: "weekly",
    lastRun: "2024-01-14T09:00:00Z",
    nextRun: "2024-01-21T09:00:00Z",
    recipients: 2,
    status: "active",
  },
  {
    id: "TPL-003",
    name: "Monthly Destruction Report",
    description: "Monthly summary of destruction activities and compliance",
    category: "compliance",
    frequency: "monthly",
    lastRun: "2024-01-01T10:00:00Z",
    nextRun: "2024-02-01T10:00:00Z",
    recipients: 5,
    status: "active",
  },
]

const mockGeneratedReports = [
  {
    id: "RPT-2024-001",
    name: "Daily Seizures Summary - Jan 15, 2024",
    template: "Daily Seizures Summary",
    generatedAt: "2024-01-15T08:00:00Z",
    generatedBy: "System Scheduler",
    format: "PDF",
    size: "2.3 MB",
    status: "completed",
    downloadUrl: "#",
  },
  {
    id: "RPT-2024-002",
    name: "Audit Exceptions Report - Jan 15, 2024",
    template: "Audit Exceptions",
    generatedAt: "2024-01-15T14:30:00Z",
    generatedBy: "Admin Meron",
    format: "CSV",
    size: "156 KB",
    status: "completed",
    downloadUrl: "#",
  },
  {
    id: "RPT-2024-003",
    name: "Evidence Package - CNB-2024-001",
    template: "Evidence Package",
    generatedAt: "2024-01-15T16:20:00Z",
    generatedBy: "Auditor Sara",
    format: "ZIP",
    size: "45.2 MB",
    status: "processing",
    downloadUrl: null,
  },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("templates")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "default" as const, label: "Active", icon: CheckCircle },
      inactive: { variant: "secondary" as const, label: "Inactive", icon: Clock },
      completed: { variant: "default" as const, label: "Completed", icon: CheckCircle },
      processing: { variant: "secondary" as const, label: "Processing", icon: Clock },
      failed: { variant: "destructive" as const, label: "Failed", icon: AlertCircle },
    }
    return variants[status as keyof typeof variants] || { variant: "outline" as const, label: status, icon: Clock }
  }

  const getCategoryBadge = (category: string) => {
    const variants = {
      operational: { variant: "default" as const, label: "Operational" },
      compliance: { variant: "secondary" as const, label: "Compliance" },
      security: { variant: "destructive" as const, label: "Security" },
      analytics: { variant: "outline" as const, label: "Analytics" },
    }
    return variants[category as keyof typeof variants] || { variant: "outline" as const, label: category }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600 mt-1">Generate and manage system reports</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Report Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Template Name</Label>
                    <Input placeholder="Enter template name..." />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Describe what this report includes..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Output Format</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="zip">Evidence Package (ZIP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Data Sources</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="seizures" />
                      <Label htmlFor="seizures">Seizure Records</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="transfers" />
                      <Label htmlFor="transfers">Transfer Activities</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="inventory" />
                      <Label htmlFor="inventory">Inventory Data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="audit" />
                      <Label htmlFor="audit">Audit Logs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="destruction" />
                      <Label htmlFor="destruction">Destruction Records</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Recipients</Label>
                  <Textarea placeholder="Enter email addresses, one per line..." />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline">Save Draft</Button>
                  <Button>Create Template</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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
                      <SelectItem value="evidence">Evidence Package</SelectItem>
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
                  <Label>Filters (Optional)</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Officer/User" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="bekele">Officer Bekele</SelectItem>
                        <SelectItem value="ahmed">Supervisor Ahmed</SelectItem>
                        <SelectItem value="tigist">Manager Tigist</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                        <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                        <SelectItem value="field">Field Storage</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <Button variant="outline">Save as Template</Button>
                  <Button>Generate Report</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">24</p>
                <p className="text-sm text-slate-600">Reports Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">8</p>
                <p className="text-sm text-slate-600">Scheduled Templates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">156</p>
                <p className="text-sm text-slate-600">Total Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">98%</p>
                <p className="text-sm text-slate-600">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <Button variant={activeTab === "templates" ? "default" : "outline"} onClick={() => setActiveTab("templates")}>
            Templates
          </Button>
          <Button variant={activeTab === "generated" ? "default" : "outline"} onClick={() => setActiveTab("generated")}>
            Generated Reports
          </Button>
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="analytics">Analytics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeTab === "templates" && (
        <div className="grid gap-4">
          {mockReportTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge {...getCategoryBadge(template.category)}>{getCategoryBadge(template.category).label}</Badge>
                    <Badge {...getStatusBadge(template.status)}>{getStatusBadge(template.status).label}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium">Frequency</p>
                      <p className="text-sm text-slate-600 capitalize">{template.frequency}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium">Last Run</p>
                      <p className="text-sm text-slate-600">{new Date(template.lastRun).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium">Next Run</p>
                      <p className="text-sm text-slate-600">{new Date(template.nextRun).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium">Recipients</p>
                      <p className="text-sm text-slate-600">{template.recipients} users</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    Generate Now
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "generated" && (
        <div className="grid gap-4">
          {mockGeneratedReports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 mb-1">{report.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>Generated by {report.generatedBy}</span>
                      <span>{new Date(report.generatedAt).toLocaleString()}</span>
                      <span>
                        {report.format} • {report.size}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge {...getStatusBadge(report.status)}>{getStatusBadge(report.status).label}</Badge>
                    {report.status === "completed" && (
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
