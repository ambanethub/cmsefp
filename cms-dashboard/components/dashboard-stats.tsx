"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, CheckCircle, TrendingUp, Warehouse, ArrowRightLeft, Trash2 } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ElementType
  description?: string
  badge?: string
}

function StatCard({ title, value, change, changeType, icon: Icon, description, badge }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {badge && <Badge variant="secondary">{badge}</Badge>}
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <div
            className={`text-xs flex items-center mt-1 ${
              changeType === "positive"
                ? "text-green-600"
                : changeType === "negative"
                  ? "text-red-600"
                  : "text-muted-foreground"
            }`}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            {change}
          </div>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

interface DashboardStatsProps {
  userRole: string
}

export function DashboardStats({ userRole }: DashboardStatsProps) {
  // Mock data - in real app, this would come from API
  const stats = {
    todaySeizures: 12,
    pendingTransfers: 5,
    pendingDestruction: 2,
    inventoryHealth: 98,
    totalItems: 1247,
    flaggedItems: 3,
    completedTransfers: 28,
    scheduledDestruction: 1,
  }

  const getStatsForRole = () => {
    const commonStats = [
      {
        title: "Today's Seizures",
        value: stats.todaySeizures,
        change: "+3 from yesterday",
        changeType: "positive" as const,
        icon: Package,
        description: "New items registered today",
      },
    ]

    switch (userRole) {
      case "Admin":
      case "Supervisor":
        return [
          ...commonStats,
          {
            title: "Pending Transfers",
            value: stats.pendingTransfers,
            badge: "Urgent",
            icon: ArrowRightLeft,
            description: "Awaiting approval",
          },
          {
            title: "Pending Destruction",
            value: stats.pendingDestruction,
            icon: Trash2,
            description: "Awaiting final approval",
          },
          {
            title: "Flagged Items",
            value: stats.flaggedItems,
            changeType: "negative" as const,
            icon: AlertTriangle,
            description: "Require attention",
          },
        ]

      case "Warehouse Manager":
        return [
          ...commonStats,
          {
            title: "Inventory Health",
            value: `${stats.inventoryHealth}%`,
            change: "+2% this week",
            changeType: "positive" as const,
            icon: Warehouse,
            description: "Items properly stored",
          },
          {
            title: "Incoming Transfers",
            value: stats.pendingTransfers,
            icon: ArrowRightLeft,
            description: "Awaiting receipt",
          },
          {
            title: "Total Items",
            value: stats.totalItems.toLocaleString(),
            icon: Package,
            description: "In all locations",
          },
        ]

      case "Field Officer":
        return [
          ...commonStats,
          {
            title: "My Seizures",
            value: 8,
            change: "+2 today",
            changeType: "positive" as const,
            icon: Package,
            description: "Items I've registered",
          },
          {
            title: "Pending Sync",
            value: 0,
            icon: CheckCircle,
            description: "All data synchronized",
          },
        ]

      case "Auditor":
        return [
          ...commonStats,
          {
            title: "Audit Flags",
            value: stats.flaggedItems,
            icon: AlertTriangle,
            description: "Items requiring review",
          },
          {
            title: "Completed Audits",
            value: 15,
            change: "+5 this week",
            changeType: "positive" as const,
            icon: CheckCircle,
            description: "Audits completed",
          },
          {
            title: "Integrity Score",
            value: "99.8%",
            change: "+0.1%",
            changeType: "positive" as const,
            icon: CheckCircle,
            description: "Chain-of-custody integrity",
          },
        ]

      default:
        return commonStats
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {getStatsForRole().map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
