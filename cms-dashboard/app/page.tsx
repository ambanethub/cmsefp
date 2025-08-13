"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, FileText, MapPin, Calendar, Download, Filter, RefreshCw, MessageSquare } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"

export default function Dashboard() {
  const [currentPath] = useState("/dashboard")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("cms_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <DashboardHeader userRole={user.role} userName={user.name} notificationCount={7} />

        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <DashboardSidebar userRole={user.role} currentPath={currentPath} />

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 space-y-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                  <p className="text-muted-foreground">
                    Welcome back, {user.name}. Here's what's happening with your contraband management.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <DashboardStats userRole={user.role} />

              {/* Main Dashboard Grid */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Recent Activity - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <RecentActivity userRole={user.role} />
                </div>

                {/* Quick Actions & Alerts */}
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {user.role === "Field Officer" && (
                        <Button className="w-full justify-start" variant="default">
                          <FileText className="h-4 w-4 mr-2" />
                          Register New Seizure
                        </Button>
                      )}
                      {(user.role === "Supervisor" || user.role === "Admin") && (
                        <>
                          <Button className="w-full justify-start bg-transparent" variant="outline">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Generate Report
                          </Button>
                          <Button className="w-full justify-start bg-transparent" variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Review Pending Items
                          </Button>
                        </>
                      )}
                      {(user.role === "Warehouse Manager" || user.role === "Admin") && (
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <MapPin className="h-4 w-4 mr-2" />
                          Inventory Audit
                        </Button>
                      )}
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <Button className="w-full justify-start bg-transparent" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Task
                      </Button>
                    </CardContent>
                  </Card>

                  {/* System Alerts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">System Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div>
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">New Messages</p>
                          <p className="text-xs text-blue-600 dark:text-blue-300">
                            4 unread messages from team members
                          </p>
                        </div>
                        <Badge variant="secondary">4</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div>
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Pending Approvals</p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-300">
                            5 transfer requests awaiting approval
                          </p>
                        </div>
                        <Badge variant="secondary">5</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div>
                          <p className="text-sm font-medium text-red-800 dark:text-red-200">Audit Flags</p>
                          <p className="text-xs text-red-600 dark:text-red-300">3 items require immediate attention</p>
                        </div>
                        <Badge variant="destructive">3</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">System Health</p>
                          <p className="text-xs text-green-600 dark:text-green-300">All systems operational</p>
                        </div>
                        <Badge className="bg-green-500 hover:bg-green-600">Good</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">System Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Database</span>
                        <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Messaging Service</span>
                        <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Backup Service</span>
                        <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Audit Service</span>
                        <Badge className="bg-green-500 hover:bg-green-600">Running</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Backup</span>
                        <span className="text-sm text-muted-foreground">2 hours ago</span>
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
