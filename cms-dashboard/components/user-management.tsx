"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { UserPlus, Edit, Trash2, Key, Activity, Search } from "lucide-react"

interface User {
  id: string
  username: string
  displayName: string
  email: string
  phone: string
  role: string
  agency: string
  station: string
  active: boolean
  mfaEnabled: boolean
  lastLogin: string
  createdAt: string
}

const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    displayName: "System Administrator",
    email: "admin@police.gov.et",
    phone: "+251911234567",
    role: "Admin",
    agency: "Federal Police",
    station: "Headquarters",
    active: true,
    mfaEnabled: true,
    lastLogin: "2024-01-15 09:30",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    username: "supervisor1",
    displayName: "Inspector Alemayehu Tadesse",
    email: "alemayehu@police.gov.et",
    phone: "+251911234568",
    role: "Supervisor",
    agency: "Federal Police",
    station: "Addis Ababa Central",
    active: true,
    mfaEnabled: true,
    lastLogin: "2024-01-15 08:45",
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    username: "officer1",
    displayName: "Officer Meron Bekele",
    email: "meron@police.gov.et",
    phone: "+251911234569",
    role: "Field Officer",
    agency: "Federal Police",
    station: "Bole Airport",
    active: true,
    mfaEnabled: false,
    lastLogin: "2024-01-15 07:20",
    createdAt: "2024-01-03",
  },
]

const roles = ["Admin", "Supervisor", "Warehouse Manager", "Field Officer", "Auditor", "Guest"]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [newUser, setNewUser] = useState({
    username: "",
    displayName: "",
    email: "",
    phone: "",
    role: "",
    agency: "",
    station: "",
    requirePasswordChange: true,
    forceMFA: false,
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const handleCreateUser = () => {
    const user: User = {
      id: Date.now().toString(),
      username: newUser.username,
      displayName: newUser.displayName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      agency: newUser.agency,
      station: newUser.station,
      active: true,
      mfaEnabled: newUser.forceMFA,
      lastLogin: "Never",
      createdAt: new Date().toISOString().split("T")[0],
    }

    setUsers([...users, user])
    setNewUser({
      username: "",
      displayName: "",
      email: "",
      phone: "",
      role: "",
      agency: "",
      station: "",
      requirePasswordChange: true,
      forceMFA: false,
    })
    setIsCreateDialogOpen(false)
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, active: !user.active } : user)))
  }

  const toggleMFA = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, mfaEnabled: !user.mfaEnabled } : user)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage system users and their permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new user to the system with appropriate role and permissions.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={newUser.displayName}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="agency">Agency</Label>
                <Input
                  id="agency"
                  value={newUser.agency}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, agency: e.target.value }))}
                  placeholder="Enter agency"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="station">Station</Label>
                <Input
                  id="station"
                  value={newUser.station}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, station: e.target.value }))}
                  placeholder="Enter station/location"
                />
              </div>
              <div className="col-span-2 space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requirePasswordChange"
                    checked={newUser.requirePasswordChange}
                    onCheckedChange={(checked) => setNewUser((prev) => ({ ...prev, requirePasswordChange: checked }))}
                  />
                  <Label htmlFor="requirePasswordChange">Require password change on first login</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="forceMFA"
                    checked={newUser.forceMFA}
                    onCheckedChange={(checked) => setNewUser((prev) => ({ ...prev, forceMFA: checked }))}
                  />
                  <Label htmlFor="forceMFA">Force MFA activation</Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Agency/Station</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>MFA</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.displayName}</div>
                      <div className="text-sm text-muted-foreground">{user.username}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user.agency}</div>
                      <div className="text-muted-foreground">{user.station}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch checked={user.active} onCheckedChange={() => toggleUserStatus(user.id)} size="sm" />
                      <Badge variant={user.active ? "default" : "secondary"}>
                        {user.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch checked={user.mfaEnabled} onCheckedChange={() => toggleMFA(user.id)} size="sm" />
                      <Badge variant={user.mfaEnabled ? "default" : "outline"}>
                        {user.mfaEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Activity className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
