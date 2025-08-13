"use client"

import type React from "react"

import { useState } from "react"
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ArrowRightLeft,
  Trash2,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Shield,
  Users,
  MapPin,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface SidebarItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: number
  roles: string[]
}

const sidebarItems: SidebarItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    roles: ["Admin", "Supervisor", "Warehouse Manager", "Field Officer", "Auditor"],
  },
  {
    icon: Package,
    label: "Seizures",
    href: "/seizures",
    roles: ["Admin", "Supervisor", "Warehouse Manager", "Field Officer"],
  },
  {
    icon: Warehouse,
    label: "Inventory",
    href: "/inventory",
    badge: 3,
    roles: ["Admin", "Supervisor", "Warehouse Manager"],
  },
  {
    icon: ArrowRightLeft,
    label: "Transfers",
    href: "/transfers",
    badge: 5,
    roles: ["Admin", "Supervisor", "Warehouse Manager"],
  },
  {
    icon: Trash2,
    label: "Destruction",
    href: "/destruction",
    badge: 2,
    roles: ["Admin", "Supervisor"],
  },
  {
    icon: MessageSquare,
    label: "Messages",
    href: "/messages",
    badge: 4,
    roles: ["Admin", "Supervisor", "Warehouse Manager", "Field Officer", "Auditor"],
  },
  {
    icon: FileText,
    label: "Audit Logs",
    href: "/audit",
    roles: ["Admin", "Supervisor", "Auditor"],
  },
  {
    icon: BarChart3,
    label: "Reports",
    href: "/reports",
    roles: ["Admin", "Supervisor", "Auditor"],
  },
  {
    icon: Users,
    label: "Users",
    href: "/users",
    roles: ["Admin"],
  },
  {
    icon: MapPin,
    label: "Locations",
    href: "/locations",
    roles: ["Admin", "Warehouse Manager"],
  },
  {
    icon: Settings,
    label: "Admin",
    href: "/admin",
    roles: ["Admin"],
  },
  {
    icon: HelpCircle,
    label: "Help",
    href: "/help",
    roles: ["Admin", "Supervisor", "Warehouse Manager", "Field Officer", "Auditor"],
  },
]

interface DashboardSidebarProps {
  userRole: string
  currentPath: string
}

export function DashboardSidebar({ userRole, currentPath }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const filteredItems = sidebarItems.filter((item) => item.roles.includes(userRole))

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Collapse Toggle */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-sidebar-primary" />
            <span className="font-semibold text-sidebar-foreground">Navigation</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.href

          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
                collapsed ? "px-2" : "px-3",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4", collapsed ? "" : "mr-3")} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          )
        })}
      </nav>

      {/* FAB for Field Officers */}
      {userRole === "Field Officer" && (
        <div className="p-4 border-t">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size={collapsed ? "icon" : "default"}
          >
            <Plus className="h-4 w-4" />
            {!collapsed && <span className="ml-2">New Seizure</span>}
          </Button>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t">
        <div className={cn("text-xs text-sidebar-foreground/60", collapsed ? "text-center" : "")}>
          {collapsed ? (
            "v1.0"
          ) : (
            <>
              <div>Version 1.0.0</div>
              <div>Last sync: 2 min ago</div>
              <div className="text-green-500">PROD Environment</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
