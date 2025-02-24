"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"

export function NoTenantDashboard({ user }) {
  const [inviteCode, setInviteCode] = useState("")
  const router = useRouter()

  const handleCreateTenant = () => {
    router.push("/tenant/create")
  }

  const handleJoinTenant = async () => {
    if (!inviteCode.trim()) {
      toast.error("Please enter an invite code")
      return
    }

    try {
      const response = await fetch("/api/tenant/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inviteCode }),
      })

      if (response.ok) {
        toast.success("Successfully joined the tenant")
        router.refresh()
      } else {
        const data = await response.json()
        toast.error(data.message || "Failed to join tenant")
      }
    } catch (error) {
      console.error("Error joining tenant:", error)
      toast.error("An error occurred while joining the tenant")
    }
  }

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Welcome, {user.name || user.email}!</h1>
      <p className="text-lg">You are not part of any tenant yet.</p>

      <div className="space-y-4">
        <Button onClick={handleCreateTenant} className="w-full">
          Create Tenant 🏢
        </Button>

        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Enter invite code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
          <Button onClick={handleJoinTenant}>Join Tenant 🔑</Button>
        </div>
      </div>
    </div>
  )
}

