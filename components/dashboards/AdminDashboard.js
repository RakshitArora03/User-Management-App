"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTenants: 0,
    activeUsers: 0,
  })

  const fetchStats = async () => {
    // In a real application, this would be an API call
    setStats({
      totalUsers: 100,
      totalTenants: 5,
      activeUsers: 75,
    })
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
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-medium">Total Tenants</h3>
            <p className="text-2xl font-bold">{stats.totalTenants}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h3 className="font-medium">Active Users</h3>
            <p className="text-2xl font-bold">{stats.activeUsers}</p>
          </div>
        </div>
        <Button onClick={fetchStats} className="mt-4">
          Refresh Stats
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Controls</h2>
        <ul className="space-y-2">
          <li>
            <Button variant="outline" className="w-full justify-start">
              Manage Users
            </Button>
          </li>
          <li>
            <Button variant="outline" className="w-full justify-start">
              Manage Tenants
            </Button>
          </li>
          <li>
            <Button variant="outline" className="w-full justify-start">
              System Settings
            </Button>
          </li>
          <li>
            <Button variant="outline" className="w-full justify-start">
              View Logs
            </Button>
          </li>
        </ul>
      </div>
    </div>
  )
}

