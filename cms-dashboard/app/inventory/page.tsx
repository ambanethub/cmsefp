"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { InventoryOverview } from "@/components/inventory-overview"
import { Button } from "@/components/ui/button"
import { Plus, Scan, FileText } from "lucide-react"
import Link from "next/link"

export default function InventoryPage() {
  const { user } = useAuth()
  const [currentPath] = useState("/inventory")

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
        <DashboardHeader userRole={user.role} userName={user.name} notificationCount={7} />

        <div className="flex h-[calc(100vh-4rem)]">
          <DashboardSidebar userRole={user.role} currentPath={currentPath} />

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Inventory & Storage</h1>
                  <p className="text-muted-foreground">Manage storage locations and track inventory</p>
                </div>
                <div className="flex items-center space-x-2">
                  {(user.role === "Warehouse Manager" || user.role === "Admin") && (
                    <>
                      <Link href="/inventory/scan">
                        <Button>
                          <Scan className="h-4 w-4 mr-2" />
                          Scan Items
                        </Button>
                      </Link>
                      <Link href="/inventory/audit">
                        <Button variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Start Audit
                        </Button>
                      </Link>
                    </>
                  )}
                  {user.role === "Admin" && (
                    <Link href="/inventory/locations/new">
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Location
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <InventoryOverview userRole={user.role} />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
