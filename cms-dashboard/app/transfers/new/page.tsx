"use client"

import type React from "react"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Package, MapPin, User, Clock, FileText, Send, Save, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface TransferRequest {
  contrabandItems: string[]
  fromLocation: string
  toLocation: string
  reason: string
  urgency: "Normal" | "Urgent"
  scheduledPickup?: string
  notes: string
  attachments: File[]
  requiresSignature: boolean
}

const mockContrabandItems = [
  { id: "1", code: "CMS-001234", type: "Drugs", location: "Bole Airport" },
  { id: "2", code: "CMS-001235", type: "Weapons", location: "Evidence Room Central" },
  { id: "3", code: "CMS-001236", type: "Currency", location: "Border Checkpoint" },
  { id: "4", code: "CMS-001237", type: "Electronics", location: "Warehouse A" },
]

const locations = [
  "Bole Airport",
  "Evidence Room Central",
  "Warehouse A",
  "Warehouse B",
  "Secure Vault B",
  "Border Checkpoint",
  "Federal Police HQ",
]

export default function NewTransferPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentPath] = useState("/transfers/new")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [transferRequest, setTransferRequest] = useState<TransferRequest>({
    contrabandItems: [],
    fromLocation: "",
    toLocation: "",
    reason: "",
    urgency: "Normal",
    scheduledPickup: "",
    notes: "",
    attachments: [],
    requiresSignature: true,
  })

  const handleInputChange = (field: keyof TransferRequest, value: any) => {
    setTransferRequest((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleItemSelection = (itemId: string, checked: boolean) => {
    if (checked) {
      setTransferRequest((prev) => ({
        ...prev,
        contrabandItems: [...prev.contrabandItems, itemId],
      }))
    } else {
      setTransferRequest((prev) => ({
        ...prev,
        contrabandItems: prev.contrabandItems.filter((id) => id !== itemId),
      }))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setTransferRequest((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }))
  }

  const removeAttachment = (index: number) => {
    setTransferRequest((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Mock API call - in real app, this would call your Spring Boot API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to transfers list
      router.push("/transfers")
    } catch (error) {
      console.error("Transfer request failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedItems = mockContrabandItems.filter((item) => transferRequest.contrabandItems.includes(item.id))

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthGuard requiredRoles={["Field Officer", "Supervisor", "Admin"]}>
      <div className="min-h-screen bg-background">
        <DashboardHeader userRole={user.role} userName={user.name} notificationCount={7} />

        <div className="flex h-[calc(100vh-4rem)]">
          <DashboardSidebar userRole={user.role} currentPath={currentPath} />

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">New Transfer Request</h1>
                  <p className="text-muted-foreground">Request custody transfer of contraband items</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                {/* Main Form - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Item Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Select Items to Transfer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockContrabandItems.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <Checkbox
                              id={item.id}
                              checked={transferRequest.contrabandItems.includes(item.id)}
                              onCheckedChange={(checked) => handleItemSelection(item.id, checked as boolean)}
                            />
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <div className="font-mono text-sm">{item.code}</div>
                                <div className="text-sm text-muted-foreground">{item.type}</div>
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {item.location}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {transferRequest.contrabandItems.length === 0 && (
                        <Alert className="mt-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>Please select at least one item to transfer.</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>

                  {/* Transfer Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Transfer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fromLocation">From Location</Label>
                          <Select
                            value={transferRequest.fromLocation}
                            onValueChange={(value) => handleInputChange("fromLocation", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select source location" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="toLocation">To Location</Label>
                          <Select
                            value={transferRequest.toLocation}
                            onValueChange={(value) => handleInputChange("toLocation", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination location" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Transfer *</Label>
                        <Textarea
                          id="reason"
                          value={transferRequest.reason}
                          onChange={(e) => handleInputChange("reason", e.target.value)}
                          placeholder="Explain why this transfer is necessary"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Urgency Level</Label>
                        <RadioGroup
                          value={transferRequest.urgency}
                          onValueChange={(value) => handleInputChange("urgency", value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Normal" id="normal" />
                            <Label htmlFor="normal">Normal</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Urgent" id="urgent" />
                            <Label htmlFor="urgent">Urgent</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scheduledPickup">Scheduled Pickup (Optional)</Label>
                        <Input
                          id="scheduledPickup"
                          type="datetime-local"
                          value={transferRequest.scheduledPickup}
                          onChange={(e) => handleInputChange("scheduledPickup", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          value={transferRequest.notes}
                          onChange={(e) => handleInputChange("notes", e.target.value)}
                          placeholder="Any additional information or special instructions"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Attachments */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Attachments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="attachments">Supporting Documents</Label>
                        <Input
                          id="attachments"
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                        />
                        <p className="text-sm text-muted-foreground">
                          Upload photos, documents, or other supporting files
                        </p>
                      </div>

                      {transferRequest.attachments.length > 0 && (
                        <div className="space-y-2">
                          <Label>Uploaded Files</Label>
                          {transferRequest.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm">{file.name}</span>
                              </div>
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="requiresSignature"
                          checked={transferRequest.requiresSignature}
                          onCheckedChange={(checked) => handleInputChange("requiresSignature", checked)}
                        />
                        <Label htmlFor="requiresSignature">Require digital signature on receipt</Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar - 1 column */}
                <div className="space-y-6">
                  {/* Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || transferRequest.contrabandItems.length === 0}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? "Submitting..." : "Submit Request"}
                      </Button>
                      <Button type="button" variant="outline" className="w-full bg-transparent">
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Request Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Request Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Items Selected</Label>
                        <p className="text-lg font-medium">{transferRequest.contrabandItems.length}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">From</Label>
                        <p className="text-sm">{transferRequest.fromLocation || "Not selected"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">To</Label>
                        <p className="text-sm">{transferRequest.toLocation || "Not selected"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Urgency</Label>
                        <Badge
                          className={
                            transferRequest.urgency === "Urgent" ? "bg-red-500 text-white" : "bg-gray-500 text-white"
                          }
                        >
                          {transferRequest.urgency}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Requested By</Label>
                        <p className="text-sm flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {user?.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Selected Items */}
                  {selectedItems.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Selected Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedItems.map((item) => (
                            <div key={item.id} className="flex items-center space-x-2 p-2 bg-muted rounded">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="font-mono text-xs">{item.code}</div>
                                <div className="text-xs text-muted-foreground">{item.type}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Process Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Process Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Supervisor approval required</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Warehouse receipt confirmation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>Audit trail automatically generated</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
