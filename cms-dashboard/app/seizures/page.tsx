"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { SeizureList } from "@/components/seizure-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function SeizuresPage() {
  const { user } = useAuth()
  const [currentPath] = useState("/seizures")

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
                  <h1 className="text-3xl font-bold text-foreground">Seizures</h1>
                  <p className="text-muted-foreground">Manage contraband seizures and evidence</p>
                </div>
                {(user.role === "Field Officer" || user.role === "Supervisor" || user.role === "Admin") && (
                  <Link href="/seizures/register">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Register Seizure
                    </Button>
                  </Link>
                )}
              </div>

              <SeizureList userRole={user.role} />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
