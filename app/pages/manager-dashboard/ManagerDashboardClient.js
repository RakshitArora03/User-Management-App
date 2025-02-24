"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function ManagerDashboardClient({ user }) {
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
    if (userRole !== "Manager") {
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
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
        <p className="text-lg opacity-90">Welcome, {user.name}! Manage your team and projects here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Team Overview</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium">Active Team Members</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium">Projects in Progress</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full p-4 text-left rounded-lg border hover:bg-gray-50">
              <h3 className="font-medium">Manage Team</h3>
              <p className="text-sm text-gray-500">View and manage team members</p>
            </button>
            <button className="w-full p-4 text-left rounded-lg border hover:bg-gray-50">
              <h3 className="font-medium">Project Settings</h3>
              <p className="text-sm text-gray-500">Configure project parameters</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

