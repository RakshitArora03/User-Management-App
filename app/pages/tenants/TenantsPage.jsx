"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, MoreVertical, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRole } from "@/context/RoleContext"
import toast from "react-hot-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useSession } from "next-auth/react"

export default function TenantsPage({ user }) {
  const router = useRouter()
  const { role } = useRole()
  const { data: session, update } = useSession()
  const [tenants, setTenants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [tenantCode, setTenantCode] = useState("") // Renamed from inviteCode

  const fetchTenants = useCallback(async () => {
    try {
      const response = await fetch("/api/tenants")
      if (!response.ok) throw new Error("Failed to fetch tenants")
      const data = await response.json()
      setTenants(data)
    } catch (error) {
      toast.error("Error loading tenants")
      console.error("Error fetching tenants:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTenants()
  }, [fetchTenants])

  const handleJoinTenant = async () => {
    try {
      const response = await fetch("/api/tenants/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tenantCode }), // Changed from inviteCode
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        setShowJoinDialog(false)
        setTenantCode("") // Reset the input
        await fetchTenants() // Refresh the tenants list
      } else {
        toast.error(data.message || "Failed to join tenant")
      }
    } catch (error) {
      console.error("Error joining tenant:", error)
      toast.error("An error occurred while joining the tenant")
    }
  }

  const filteredTenants = tenants.filter((tenant) => tenant.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleCreateTenant = () => {
    router.push("/pages/tenants/create")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Loading tenants...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tenants</h1>
          <p className="text-gray-500">Manage your organization's tenants</p>
        </div>
        {role === "Admin" && (
          <Button onClick={handleCreateTenant}>
            <Plus className="w-4 h-4 mr-2" />
            Create Tenant
          </Button>
        )}
        {role !== "Admin" && <Button onClick={() => setShowJoinDialog(true)}>Join Tenant</Button>}
      </div>

      {tenants.length > 0 ? (
        <>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search tenants..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Industry</th>
                    <th className="text-left p-4">Country</th>
                    <th className="text-left p-4">Your Role</th>
                    <th className="text-left p-4">Status</th>
                    {role === "Admin" && <th className="text-right p-4">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.map((tenant) => (
                    <tr key={tenant._id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-5 h-5 text-gray-500" />
                          <span className="font-medium">{tenant.name}</span>
                        </div>
                      </td>
                      <td className="p-4">{tenant.industryType}</td>
                      <td className="p-4">{tenant.country}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tenant.userRole}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tenant.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {tenant.status}
                        </span>
                      </td>
                      {role === "Admin" && (
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="xl" variant="secondary" className="h-8 w-8 p-0">
                                <MoreVertical className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Tenant</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete Tenant</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">No tenants found</h2>
          {role === "Admin" ? (
            <>
              <p className="mb-4">Start by creating a tenant to manage your organization.</p>
              <Button onClick={() => router.push("/pages/tenants/create")}>Create Tenant</Button>
            </>
          ) : (
            <>
              <p className="mb-4">You haven't joined any tenants yet.</p>
              <Button onClick={() => setShowJoinDialog(true)}>Join Tenant</Button>
            </>
          )}
        </div>
      )}

      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join a Tenant</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="tenantCode" className="text-right">
                Tenant Code
              </label>
              <Input
                id="tenantCode"
                value={tenantCode}
                onChange={(e) => setTenantCode(e.target.value)}
                className="col-span-3"
                placeholder="Enter the tenant code"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleJoinTenant} disabled={!tenantCode.trim()}>
              Join Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

