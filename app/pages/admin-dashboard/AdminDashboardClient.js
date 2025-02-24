"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function AdminDashboardClient({ user }) {
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
    if (userRole !== "Admin") {
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
      <div className="bg-gradient-to-r from-purple-700 to-blue-700 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-lg opacity-90">Hello, {user.name || "Admin"}! You have full access to manage the system.</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-medium">Total Users</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-medium">Total Tenants</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h3 className="font-medium">Active Users</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 text-left rounded-lg border hover:bg-gray-50">
            <h3 className="font-medium">Manage Users</h3>
            <p className="text-sm text-gray-500">Add, remove, and modify user accounts</p>
          </button>
          <button className="p-4 text-left rounded-lg border hover:bg-gray-50">
            <h3 className="font-medium">Manage Tenants</h3>
            <p className="text-sm text-gray-500">Configure and oversee tenant settings</p>
          </button>
          <button className="p-4 text-left rounded-lg border hover:bg-gray-50">
            <h3 className="font-medium">System Settings</h3>
            <p className="text-sm text-gray-500">Adjust global system configurations</p>
          </button>
          <button className="p-4 text-left rounded-lg border hover:bg-gray-50">
            <h3 className="font-medium">View Logs</h3>
            <p className="text-sm text-gray-500">Monitor system activity and events</p>
          </button>
        </div>
      </div>
    </div>
  )
}

