import MessagingSystem from "@/components/messaging-system"

export default function MessagesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-600 mt-1">Communicate with team members and manage notifications</p>
      </div>

      <MessagingSystem />
    </div>
  )
}
