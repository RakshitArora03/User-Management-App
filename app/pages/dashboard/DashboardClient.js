"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRole } from "@/context/RoleContext"
import AdminDashboard from "@/components/dashboards/AdminDashboard"
import ManagerDashboard from "@/components/dashboards/ManagerDashboard"
import UserDashboard from "@/components/dashboards/UserDashboard"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"

export default function DashboardClient({ user }) {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const { role, setRole } = useRole()
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [inviteCode, setInviteCode] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin")
    }
  }, [status, router])

  const handleJoinTenant = async () => {
    try {
      const response = await fetch("/api/invites/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inviteCode }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Successfully joined tenant")
        setShowJoinDialog(false)
        // Update the session with the new role and tenantId
        await update({
          ...session,
          user: {
            ...session.user,
            role: data.user.role,
            tenantId: data.user.tenantId,
          },
        })
        setRole(data.user.role)
        router.refresh()
      } else {
        toast.error(data.message || "Failed to join tenant")
      }
    } catch (error) {
      console.error("Error joining tenant:", error)
      toast.error("An error occurred while joining the tenant")
    }
  }

  if (status === "loading" || !role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while we prepare your dashboard.</p>
        </div>
      </div>
    )
  }

  const DashboardComponent = {
    Admin: AdminDashboard,
    Manager: ManagerDashboard,
    User: UserDashboard,
  }[role]

  if (!DashboardComponent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Welcome to the Dashboard</h2>
          <p className="text-gray-500 mb-4">You haven't joined a tenant yet.</p>
          <Button onClick={() => setShowJoinDialog(true)}>Join a Tenant</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <DashboardComponent user={user} />

      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join a Tenant</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="inviteCode" className="text-right">
                Invite Code
              </label>
              <Input
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleJoinTenant}>Join Tenant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

