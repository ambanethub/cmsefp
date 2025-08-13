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
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Users,
  MapPin,
  Shield,
  Database,
  Activity,
  Plus,
  Edit,
  Eye,
  Key,
  Server,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react"

const mockUsers = [
  {
    id: "user-1",
    username: "ahmed.supervisor",
    displayName: "Ahmed Hassan",
    email: "ahmed@police.gov.et",
    phone: "+251911234567",
    role: "Supervisor",
    station: "Central Station",
    status: "active",
    lastLogin: "2024-01-15T14:30:00Z",
    mfaEnabled: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    username: "bekele.officer",
    displayName: "Bekele Tadesse",
    email: "bekele@police.gov.et",
    phone: "+251922345678",
    role: "Field Officer",
    station: "Airport Division",
    status: "active",
    lastLogin: "2024-01-15T16:20:00Z",
    mfaEnabled: false,
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "user-3",
    username: "tigist.warehouse",
    displayName: "Tigist Alemayehu",
    email: "tigist@police.gov.et",
    phone: "+251933456789",
    role: "Warehouse Manager",
    station: "Main Warehouse",
    status: "active",
    lastLogin: "2024-01-15T12:45:00Z",
    mfaEnabled: true,
    createdAt: "2024-01-03T00:00:00Z",
  },
]

const mockLocations = [
  {
    id: "loc-1",
    name: "Main Evidence Warehouse",
    address: "Addis Ababa, Bole District",
    type: "warehouse",
    capacity: 1000,
    currentItems: 245,
    contact: "Tigist Alemayehu",
    phone: "+251933456789",
    status: "active",
    coordinates: { lat: 9.0192, lng: 38.7525 },
  },
  {
    id: "loc-2",
    name: "Airport Temporary Storage",
    address: "Bole International Airport",
    type: "temporary",
    capacity: 50,
    currentItems: 12,
    contact: "Bekele Tadesse",
    phone: "+251922345678",
    status: "active",
    coordinates: { lat: 8.9806, lng: 38.7992 },
  },
  {
    id: "loc-3",
    name: "Secure Vault A",
    address: "Federal Police HQ",
    type: "vault",
    capacity: 200,
    currentItems: 89,
    contact: "Ahmed Hassan",
    phone: "+251911234567",
    status: "active",
    coordinates: { lat: 9.0054, lng: 38.7636 },
  },
]

const mockSystemSettings = {
  general: {
    systemName: "Contraband Management System",
    defaultLanguage: "en",
    timezone: "Africa/Addis_Ababa",
    sessionTimeout: 30,
  },
  security: {
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    lockoutThreshold: 5,
    lockoutDuration: 15,
    mfaRequired: ["Admin", "Supervisor"],
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: true,
    inAppEnabled: true,
    smtpServer: "smtp.police.gov.et",
    smsProvider: "twilio",
  },
  retention: {
    auditLogRetention: 2555, // 7 years in days
    evidenceRetention: 3650, // 10 years in days
    autoArchive: true,
  },
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [userFilter, setUserFilter] = useState("all")

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "default" as const, label: "Active", icon: CheckCircle },
      inactive: { variant: "secondary" as const, label: "Inactive", icon: Clock },
      suspended: { variant: "destructive" as const, label: "Suspended", icon: AlertTriangle },
    }
    return variants[status as keyof typeof variants] || { variant: "outline" as const, label: status, icon: Clock }
  }

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Administration</h1>
          <p className="text-slate-600 mt-1">Manage users, settings, and system configuration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Config
          </Button>
          <Button variant="outline">
            <Database className="w-4 h-4 mr-2" />
            Backup System
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{mockUsers.length}</p>
                <p className="text-sm text-slate-600">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{mockLocations.length}</p>
                <p className="text-sm text-slate-600">Storage Locations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">99.8%</p>
                <p className="text-sm text-slate-600">System Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">Secure</p>
                <p className="text-sm text-slate-600">Security Status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <Input placeholder="Search users..." className="max-w-sm" />
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="supervisor">Supervisors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Username</Label>
                      <Input placeholder="username" />
                    </div>
                    <div>
                      <Label>Display Name</Label>
                      <Input placeholder="Full Name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Email</Label>
                      <Input type="email" placeholder="user@police.gov.et" />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input placeholder="+251..." />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="warehouse_manager">Warehouse Manager</SelectItem>
                          <SelectItem value="field_officer">Field Officer</SelectItem>
                          <SelectItem value="auditor">Auditor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Station</Label>
                      <Input placeholder="Station/Department" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="require-mfa" />
                      <Label htmlFor="require-mfa">Require MFA</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="force-password-change" defaultChecked />
                      <Label htmlFor="force-password-change">Force password change on first login</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="account-expiry" />
                      <Label htmlFor="account-expiry">Set account expiry date</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create User</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {mockUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-slate-700">
                          {user.displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-medium text-slate-900">{user.displayName}</h3>
                        <p className="text-sm text-slate-600">@{user.username}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant="outline">{user.role}</Badge>
                          <span className="text-sm text-slate-600">{user.station}</span>
                          {user.mfaEnabled && <Badge variant="secondary">MFA</Badge>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge {...getStatusBadge(user.status)}>{getStatusBadge(user.status).label}</Badge>
                        <p className="text-sm text-slate-600 mt-1">
                          Last login: {new Date(user.lastLogin).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Key className="w-4 h-4 mr-1" />
                          Reset Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <Input placeholder="Search locations..." className="max-w-sm" />
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                  <SelectItem value="vault">Vault</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Storage Location</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Location Name</Label>
                      <Input placeholder="Location name" />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="temporary">Temporary Storage</SelectItem>
                          <SelectItem value="vault">Secure Vault</SelectItem>
                          <SelectItem value="field">Field Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Address</Label>
                    <Textarea placeholder="Full address..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Capacity</Label>
                      <Input type="number" placeholder="Maximum items" />
                    </div>
                    <div>
                      <Label>Contact Person</Label>
                      <Input placeholder="Manager name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Phone</Label>
                      <Input placeholder="+251..." />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Latitude</Label>
                      <Input type="number" step="any" placeholder="9.0192" />
                    </div>
                    <div>
                      <Label>Longitude</Label>
                      <Input type="number" step="any" placeholder="38.7525" />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button>Add Location</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {mockLocations.map((location) => (
              <Card key={location.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-slate-900">{location.name}</h3>
                        <Badge variant="outline" className="capitalize">
                          {location.type}
                        </Badge>
                        <Badge {...getStatusBadge(location.status)}>{getStatusBadge(location.status).label}</Badge>
                      </div>

                      <p className="text-sm text-slate-600 mb-3">{location.address}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-700">Capacity</p>
                          <p className={`text-sm ${getCapacityColor(location.currentItems, location.capacity)}`}>
                            {location.currentItems} / {location.capacity} items
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Contact</p>
                          <p className="text-sm text-slate-600">{location.contact}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">Phone</p>
                          <p className="text-sm text-slate-600">{location.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        View Map
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>System Name</Label>
                  <Input value={mockSystemSettings.general.systemName} />
                </div>
                <div>
                  <Label>Default Language</Label>
                  <Select value={mockSystemSettings.general.defaultLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="am">Amharic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Timezone</Label>
                  <Select value={mockSystemSettings.general.timezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Addis_Ababa">Africa/Addis_Ababa</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Session Timeout (minutes)</Label>
                  <Input type="number" value={mockSystemSettings.general.sessionTimeout} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Password Min Length</Label>
                  <Input type="number" value={mockSystemSettings.security.passwordMinLength} />
                </div>
                <div>
                  <Label>Lockout Threshold</Label>
                  <Input type="number" value={mockSystemSettings.security.lockoutThreshold} />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch checked={mockSystemSettings.security.passwordRequireSpecial} />
                <Label>Require special characters in passwords</Label>
              </div>

              <div>
                <Label>Roles requiring MFA</Label>
                <div className="mt-2 space-y-2">
                  {["Admin", "Supervisor", "Warehouse Manager", "Field Officer", "Auditor"].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox id={role} checked={mockSystemSettings.security.mfaRequired.includes(role)} />
                      <Label htmlFor={role}>{role}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Audit Log Retention (days)</Label>
                  <Input type="number" value={mockSystemSettings.retention.auditLogRetention} />
                </div>
                <div>
                  <Label>Evidence Retention (days)</Label>
                  <Input type="number" value={mockSystemSettings.retention.evidenceRetention} />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch checked={mockSystemSettings.retention.autoArchive} />
                <Label>Enable automatic archiving</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Keys & Secrets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Database Encryption Key</p>
                    <p className="text-sm text-slate-600">Last rotated: 30 days ago</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Rotate
                    </Button>
                    <Button variant="outline" size="sm">
                      Test
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">JWT Signing Key</p>
                    <p className="text-sm text-slate-600">Last rotated: 15 days ago</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Rotate
                    </Button>
                    <Button variant="outline" size="sm">
                      Test
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">SMS Gateway API Key</p>
                    <p className="text-sm text-slate-600">Status: Active</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Update
                    </Button>
                    <Button variant="outline" size="sm">
                      Test
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">SSL Certificate</h3>
                  <p className="text-sm text-slate-600 mt-1">Valid until Dec 2024</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Firewall Status</h3>
                  <p className="text-sm text-slate-600 mt-1">Active & Protected</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-medium text-slate-900">Vulnerability Scan</h3>
                  <p className="text-sm text-slate-600 mt-1">Due in 5 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Backup & Restore
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Last Backup</p>
                  <p className="text-sm text-slate-600">January 15, 2024 at 2:00 AM</p>
                  <p className="text-sm text-slate-600">Size: 2.4 GB</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button>
                    <Database className="w-4 h-4 mr-1" />
                    Backup Now
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Restore from Backup</p>
                  <p className="text-sm text-slate-600">Upload and restore from backup file</p>
                </div>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-1" />
                  Upload Backup
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Database Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Connection</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Storage Used</span>
                      <span className="text-sm">2.4 GB / 100 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active Connections</span>
                      <span className="text-sm">12 / 100</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Application Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">API Response Time</span>
                      <span className="text-sm">45ms avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Memory Usage</span>
                      <span className="text-sm">1.2 GB / 4 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active Sessions</span>
                      <span className="text-sm">8</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">System Maintenance</h4>
                    <p className="text-sm text-slate-600">Last maintenance: 7 days ago</p>
                  </div>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Run Maintenance
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
