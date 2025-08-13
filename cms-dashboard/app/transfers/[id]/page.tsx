"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  CheckCircle,
  XCircle,
  Clock,
  Package,
  MapPin,
  User,
  Calendar,
  FileText,
  Truck,
  AlertCircle,
  MessageSquare,
  Download,
} from "lucide-react"
import { useParams } from "next/navigation"
import { apiGet } from "@/lib/api"

type Transfer = {
  id: string
  contrabandCode: string
  contrabandType: string
  fromLocation: string
  toLocation: string
  requestedBy: string
  requestedAt: string
  approvedBy?: string
  approvedAt?: string
  receivedBy?: string
  receivedAt?: string
  status: string
  reason: string
  urgency: string
  notes?: string
}

export default function TransferDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const [currentPath] = useState(`/transfers/${params.id}`)
  const [approvalNotes, setApprovalNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [transfer, setTransfer] = useState<Transfer | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : (params.id as string)
    const load = async () => {
      try {
        const data = await apiGet<Transfer>(`/transfers/${id}`)
        setTransfer(data)
      } catch (e: any) {
        setError(e?.message || "Failed to load transfer")
      }
    }
    load()
  }, [params.id])

  const handleApproval = async (approved: boolean) => {
    setIsProcessing(true)
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(`Transfer ${approved ? "approved" : "rejected"}:`, approvalNotes)
    } catch (error) {
      console.error("Approval failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReceipt = async () => {
    setIsProcessing(true)
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Transfer receipt acknowledged")
    } catch (error) {
      console.error("Receipt acknowledgment failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const canApprove = (user.role === "Supervisor" || user.role === "Admin") && transfer?.status === "Pending"
  const canReceive = (user.role === "Warehouse Manager" || user.role === "Admin") && transfer?.status === "Approved"

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <DashboardHeader userRole={user.role} userName={user.name} notificationCount={7} />

        <div className="flex h-[calc(100vh-4rem)]">
          <DashboardSidebar userRole={user.role} currentPath={currentPath} />

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Transfer #{transfer?.id || params.id}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge className="bg-gray-500 text-white">{transfer?.status || ""}</Badge>
                    <Badge
                      className={transfer?.urgency === "Urgent" ? "bg-red-500 text-white" : "bg-gray-500 text-white"}
                    >
                      {transfer?.urgency || ""}
                    </Badge>
                    <span className="text-muted-foreground">Item: {transfer?.contrabandCode}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>

              {/* Action Alerts */}
              {canApprove && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>This transfer request requires your approval as a supervisor.</AlertDescription>
                </Alert>
              )}

              {canReceive && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>This approved transfer is ready for receipt acknowledgment.</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Transfer Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Transfer Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Item Details</label>
                            <div className="flex items-center space-x-3 mt-1">
                              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-mono text-sm">{transfer?.contrabandCode}</p>
                                <p className="text-sm text-muted-foreground">
                                  {transfer?.contrabandType} - {transfer?.category}
                                </p>
                                <p className="text-sm font-medium">{transfer?.quantity}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Transfer Route</label>
                            <div className="mt-1 space-y-2">
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="font-medium">From:</span>
                                <span className="ml-2">{transfer?.fromLocation}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="font-medium">To:</span>
                                <span className="ml-2">{transfer?.toLocation}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Requested By</label>
                            <p className="text-sm flex items-center mt-1">
                              <User className="h-4 w-4 mr-2" />
                              {transfer?.requestedBy}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Request Date</label>
                            <p className="text-sm flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-2" />
                              {transfer?.requestedAt ? new Date(transfer.requestedAt).toLocaleString() : ""}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Scheduled Pickup</label>
                            <p className="text-sm flex items-center mt-1">
                              <Clock className="h-4 w-4 mr-2" />
                              {/* scheduledPickup not in API; placeholder */}
                              {""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Reason for Transfer</label>
                        <p className="text-sm mt-1">{transfer?.reason}</p>
                      </div>
                      {transfer?.notes && (
                        <>
                          <Separator className="my-4" />
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Additional Notes</label>
                            <p className="text-sm mt-1">{transfer?.notes}</p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Tabs for detailed information */}
                  <Tabs defaultValue="timeline" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                      <TabsTrigger value="attachments">Attachments</TabsTrigger>
                      <TabsTrigger value="signatures">Signatures</TabsTrigger>
                    </TabsList>

                    <TabsContent value="timeline" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Transfer Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Mock timeline data removed */}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="attachments" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Attachments (0)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="text-sm text-muted-foreground">No attachments</div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="signatures" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Digital Signatures</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h4 className="font-medium">Requester Signature</h4>
                                <p className="text-sm text-muted-foreground">Officer Meron Bekele</p>
                                <p className="text-xs text-muted-foreground">
                                  Signed: {transfer?.requestedAt ? new Date(transfer.requestedAt).toLocaleString() : ""}
                                </p>
                              </div>
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h4 className="font-medium">Supervisor Approval</h4>
                                <p className="text-sm text-muted-foreground">Supervisor Alemayehu Tadesse</p>
                                <p className="text-xs text-muted-foreground">
                                  Signed: {transfer?.approvedAt ? new Date(transfer.approvedAt).toLocaleString() : ""}
                                </p>
                              </div>
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h4 className="font-medium">Receiver Acknowledgment</h4>
                                <p className="text-sm text-muted-foreground">Warehouse Manager Dawit Haile</p>
                                <p className="text-xs text-muted-foreground">
                                  Signed: {transfer?.receivedAt ? new Date(transfer.receivedAt).toLocaleString() : ""}
                                </p>
                              </div>
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Sidebar - 1 column */}
                <div className="space-y-6">
                  {/* Action Panel */}
                  {(canApprove || canReceive) && (
                    <Card>
                      <CardHeader>
                        <CardTitle>{canApprove ? "Approval Required" : "Receipt Acknowledgment"}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {canApprove && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="approvalNotes">Approval Notes</Label>
                              <Textarea
                                id="approvalNotes"
                                value={approvalNotes}
                                onChange={(e) => setApprovalNotes(e.target.value)}
                                placeholder="Add notes about your decision..."
                                rows={3}
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button onClick={() => handleApproval(true)} disabled={isProcessing} className="flex-1">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleApproval(false)}
                                disabled={isProcessing}
                                variant="destructive"
                                className="flex-1"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </>
                        )}

                        {canReceive && (
                          <Button onClick={handleReceipt} disabled={isProcessing} className="w-full">
                            <Truck className="h-4 w-4 mr-2" />
                            {isProcessing ? "Processing..." : "Acknowledge Receipt"}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Transfer Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Transfer Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Current Status</span>
                        <Badge className="bg-gray-500 text-white">{transfer?.status || ""}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Urgency</span>
                        <Badge
                          className={
                            transfer?.urgency === "Urgent" ? "bg-red-500 text-white" : "bg-gray-500 text-white"
                          }
                        >
                          {transfer?.urgency || ""}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Signature Required</span>
                        <Badge variant="outline">No</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full bg-transparent">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Add Comment
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Export Timeline
                      </Button>
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
