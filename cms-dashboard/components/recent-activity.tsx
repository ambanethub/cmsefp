"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Package, ArrowRightLeft, Trash2, AlertTriangle, CheckCircle, Clock, ExternalLink } from "lucide-react"

interface ActivityItem {
  id: string
  type: "seizure" | "transfer" | "destruction" | "audit" | "alert"
  title: string
  description: string
  timestamp: string
  status: "pending" | "approved" | "completed" | "flagged"
  actor: string
  contrabandCode?: string
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "seizure",
    title: "New Seizure Registered",
    description: "Narcotics seized at Bole checkpoint",
    timestamp: "2 minutes ago",
    status: "pending",
    actor: "Officer Tadesse",
    contrabandCode: "CTB-2024-001247",
  },
  {
    id: "2",
    type: "transfer",
    title: "Transfer Approved",
    description: "Items moved to Central Warehouse",
    timestamp: "15 minutes ago",
    status: "approved",
    actor: "Supervisor Alemayehu",
    contrabandCode: "CTB-2024-001245",
  },
  {
    id: "3",
    type: "audit",
    title: "Inventory Audit Completed",
    description: "Monthly audit of Zone 3 storage",
    timestamp: "1 hour ago",
    status: "completed",
    actor: "Auditor Meron",
  },
  {
    id: "4",
    type: "alert",
    title: "Discrepancy Detected",
    description: "Item location mismatch found",
    timestamp: "2 hours ago",
    status: "flagged",
    actor: "System",
    contrabandCode: "CTB-2024-001240",
  },
  {
    id: "5",
    type: "destruction",
    title: "Destruction Scheduled",
    description: "5 items scheduled for destruction",
    timestamp: "3 hours ago",
    status: "approved",
    actor: "Supervisor Bekele",
  },
]

function getActivityIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "seizure":
      return Package
    case "transfer":
      return ArrowRightLeft
    case "destruction":
      return Trash2
    case "audit":
      return CheckCircle
    case "alert":
      return AlertTriangle
    default:
      return Clock
  }
}

function getStatusColor(status: ActivityItem["status"]) {
  switch (status) {
    case "pending":
      return "bg-yellow-500"
    case "approved":
      return "bg-blue-500"
    case "completed":
      return "bg-green-500"
    case "flagged":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

interface RecentActivityProps {
  userRole: string
}

export function RecentActivity({ userRole }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <Button variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivities.map((activity) => {
          const Icon = getActivityIcon(activity.type)

          return (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
                    <Badge variant="outline" className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-xs">
                        {activity.actor
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{activity.actor}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {activity.contrabandCode && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.contrabandCode}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
