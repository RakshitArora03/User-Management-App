"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function UserDashboardClient({ user }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.replace("/auth/signin")
      return
    }

    const userRole = session.user.role
    if (userRole !== "User") {
      router.replace("/unauthorized")
      return
    }

    setIsLoading(false)
  }, [status, session, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
        <p className="text-lg opacity-90">Hello, {user.name}! Here&apos;s your personal workspace.</p>
      </div>

      {!user.tenantId && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <p className="text-yellow-700">
            <strong>Notice:</strong> You are not associated with any tenant yet. Join a tenant to access more features.
          </p>
          <Button className="mt-2" onClick={() => router.push("/pages/tenants")}>
            Join a Tenant
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Activity</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium">Recent Logins</h3>
              <p className="text-2xl font-bold">1</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium">Active Sessions</h3>
              <p className="text-2xl font-bold">1</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full p-4 text-left rounded-lg border hover:bg-gray-50">
              <h3 className="font-medium">Update Profile</h3>
              <p className="text-sm text-gray-500">Modify your account settings</p>
            </button>
            <button className="w-full p-4 text-left rounded-lg border hover:bg-gray-50">
              <h3 className="font-medium">View Tasks</h3>
              <p className="text-sm text-gray-500">Check your assigned tasks</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

