"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MessageSquare, Send, Clock, CheckCircle, Plus, Search } from "lucide-react"

const mockMessages = [
  {
    id: "MSG-001",
    subject: "Transfer Request CNB-2024-001 - Urgent Review Needed",
    from: "Officer Bekele",
    fromRole: "Field Officer",
    to: ["Supervisor Ahmed"],
    toRoles: ["Supervisor"],
    timestamp: "2024-01-15T14:30:00Z",
    status: "unread",
    priority: "high",
    relatedItem: "CNB-2024-001",
    content: "The seized cocaine needs immediate transfer to secure storage. Current location may be compromised.",
    thread: [
      {
        id: "MSG-001-1",
        from: "Officer Bekele",
        content: "The seized cocaine needs immediate transfer to secure storage. Current location may be compromised.",
        timestamp: "2024-01-15T14:30:00Z",
      },
    ],
  },
  {
    id: "MSG-002",
    subject: "Inventory Discrepancy - Warehouse A",
    from: "Warehouse Manager Tigist",
    fromRole: "Warehouse Manager",
    to: ["Supervisor Ahmed", "Admin Meron"],
    toRoles: ["Supervisor", "Admin"],
    timestamp: "2024-01-15T11:20:00Z",
    status: "read",
    priority: "medium",
    relatedItem: "WH-A-AUDIT-001",
    content: "Found 2 items missing during routine audit. Need immediate investigation.",
    thread: [
      {
        id: "MSG-002-1",
        from: "Warehouse Manager Tigist",
        content: "Found 2 items missing during routine audit. Need immediate investigation.",
        timestamp: "2024-01-15T11:20:00Z",
      },
      {
        id: "MSG-002-2",
        from: "Supervisor Ahmed",
        content: "Acknowledged. Starting investigation immediately. Please secure the area.",
        timestamp: "2024-01-15T11:45:00Z",
      },
    ],
  },
]

const mockUsers = [
  { id: "user-1", name: "Supervisor Ahmed", role: "Supervisor", status: "online" },
  { id: "user-2", name: "Officer Bekele", role: "Field Officer", status: "offline" },
  { id: "user-3", name: "Warehouse Manager Tigist", role: "Warehouse Manager", status: "online" },
  { id: "user-4", name: "Admin Meron", role: "Admin", status: "online" },
  { id: "user-5", name: "Auditor Sara", role: "Auditor", status: "offline" },
]

export default function MessagingSystem() {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [newMessageRecipients, setNewMessageRecipients] = useState<string[]>([])

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: { variant: "destructive" as const, label: "High Priority" },
      medium: { variant: "secondary" as const, label: "Medium" },
      low: { variant: "outline" as const, label: "Low" },
    }
    return variants[priority as keyof typeof variants] || { variant: "outline" as const, label: priority }
  }

  const getStatusIcon = (status: string) => {
    return status === "unread" ? (
      <div className="w-2 h-2 bg-blue-600 rounded-full" />
    ) : (
      <CheckCircle className="w-4 h-4 text-green-600" />
    )
  }

  const selectedMessageData = mockMessages.find((msg) => msg.id === selectedMessage)

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg border">
      {/* Messages List */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  New Message
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Compose Message</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Recipients</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Subject</Label>
                    <Input placeholder="Message subject..." />
                  </div>

                  <div>
                    <Label>Related Item (Optional)</Label>
                    <Input placeholder="CNB-2024-001, DR-2024-001, etc." />
                  </div>

                  <div>
                    <Label>Message</Label>
                    <Textarea placeholder="Type your message..." className="min-h-32" />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Save Draft</Button>
                    <Button>
                      <Send className="w-4 h-4 mr-1" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 border-b cursor-pointer hover:bg-slate-50 ${
                selectedMessage === message.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
              }`}
              onClick={() => setSelectedMessage(message.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(message.status)}
                  <span className="font-medium text-sm">{message.from}</span>
                  <Badge variant="outline" className="text-xs">
                    {message.fromRole}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Badge {...getPriorityBadge(message.priority)} className="text-xs">
                    {getPriorityBadge(message.priority).label}
                  </Badge>
                  <span className="text-xs text-slate-500">{new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <h3 className="font-medium text-sm mb-1 line-clamp-1">{message.subject}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">{message.content}</p>

              {message.relatedItem && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    Related: {message.relatedItem}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Message Detail */}
      <div className="flex-1 flex flex-col">
        {selectedMessageData ? (
          <>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">{selectedMessageData.subject}</h2>
                <Badge {...getPriorityBadge(selectedMessageData.priority)}>
                  {getPriorityBadge(selectedMessageData.priority).label}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {selectedMessageData.from
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedMessageData.from}</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedMessageData.fromRole}
                  </Badge>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(selectedMessageData.timestamp).toLocaleString()}</span>
                </div>

                {selectedMessageData.relatedItem && (
                  <Badge variant="outline">Related: {selectedMessageData.relatedItem}</Badge>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {selectedMessageData.thread.map((msg, index) => (
                  <div key={msg.id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-sm">
                        {msg.from
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{msg.from}</span>
                        <span className="text-xs text-slate-500">{new Date(msg.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea placeholder="Type your reply..." className="flex-1 min-h-20" />
                <Button className="self-end">
                  <Send className="w-4 h-4 mr-1" />
                  Reply
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Select a Message</h3>
              <p className="text-slate-600">Choose a message from the list to view the conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
