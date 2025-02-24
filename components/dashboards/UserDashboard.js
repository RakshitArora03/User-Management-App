"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

export default function UserDashboard({ user }) {
  const router = useRouter()
  const [userTenants, setUserTenants] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserTenants = async () => {
      try {
        const response = await fetch("/api/tenants")
        if (response.ok) {
          const data = await response.json()
          setUserTenants(data)
        }
      } catch (error) {
        console.error("Error fetching user tenants:", error)
        toast.error("Failed to load tenant information")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserTenants()
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center p-6">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {userTenants.length > 0 ? (
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
          <p className="text-lg opacity-90">
            Hello, {user.name}! You are a member of {userTenants.length} tenant(s).
          </p>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Your Tenants:</h2>
            <div className="space-y-2">
              {userTenants.map((tenant) => (
                <div key={tenant._id} className="bg-white/10 rounded-md p-3 flex items-center justify-between">
                  <span>{tenant.name}</span>
                  <span className="px-2 py-1 bg-white/20 rounded text-sm">{tenant.userRole}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <p className="text-yellow-700">
            <strong>Notice:</strong> You haven't joined any tenants yet.
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

