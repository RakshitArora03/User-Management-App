"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import toast from "react-hot-toast"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  industryType: z.string().min(1, "Please select an industry type"),
  country: z.string().min(1, "Please select a country"),
  description: z.string().optional(),
})

const industryTypes = ["Technology", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "Other"]
const countries = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "Other"]

export default function EditTenantForm({ tenantId, user }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tenant, setTenant] = useState(null)
  const [tenantUsers, setTenantUsers] = useState([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [confirmationText, setConfirmationText] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const response = await fetch(`/api/tenants/${tenantId}`)
        if (!response.ok) throw new Error("Failed to fetch tenant data")
        const data = await response.json()
        setTenant(data)
        setValue("name", data.name)
        setValue("industryType", data.industryType)
        setValue("country", data.country)
        setValue("description", data.description)
      } catch (error) {
        console.error("Error fetching tenant data:", error)
        toast.error("Failed to load tenant data")
      }
    }

    const fetchTenantUsers = async () => {
      try {
        const response = await fetch(`/api/tenants/${tenantId}/users`)
        if (!response.ok) throw new Error("Failed to fetch tenant users")
        const data = await response.json()
        setTenantUsers(data)
      } catch (error) {
        console.error("Error fetching tenant users:", error)
        toast.error("Failed to load tenant users")
      }
    }

    fetchTenantData()
    fetchTenantUsers()
  }, [tenantId, setValue])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/tenants/${tenantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update tenant")
      }

      toast.success("Tenant updated successfully")
      router.push("/pages/tenants")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUserAction = async (userId, action) => {
    setConfirmAction({ userId, action })
    setShowConfirmDialog(true)
  }

  const confirmUserAction = async () => {
    if (confirmationText !== tenant.name) {
      toast.error("Tenant name doesn't match. Please try again.")
      return
    }

    try {
      const { userId, action } = confirmAction
      const response = await fetch(`/api/tenants/${tenantId}/users/${userId}/${action}`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Failed to ${action} user`)
      }

      toast.success(`User ${action}d successfully`)
      setShowConfirmDialog(false)
      setConfirmationText("")
      // Refresh tenant users
      const updatedUsersResponse = await fetch(`/api/tenants/${tenantId}/users`)
      const updatedUsers = await updatedUsersResponse.json()
      setTenantUsers(updatedUsers)
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (!tenant) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 bg-white p-6 rounded-lg shadow">
        <div>
          <Label htmlFor="name">Tenant Name (Read-only)</Label>
          <Input id="name" {...register("name")} className={errors.name ? "border-red-500" : ""} readOnly />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="industryType">Industry Type *</Label>
          <Select onValueChange={(value) => setValue("industryType", value)} defaultValue={tenant.industryType}>
            <SelectTrigger className={errors.industryType ? "border-red-500" : ""}>
              <SelectValue placeholder="Select industry type" />
            </SelectTrigger>
            <SelectContent>
              {industryTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industryType && <p className="text-red-500 text-sm mt-1">{errors.industryType.message}</p>}
        </div>

        <div>
          <Label htmlFor="country">Country / Region *</Label>
          <Select onValueChange={(value) => setValue("country", value)} defaultValue={tenant.country}>
            <SelectTrigger className={errors.country ? "border-red-500" : ""}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea id="description" {...register("description")} className="min-h-[100px]" />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tenant Users</h2>
          {tenantUsers.map((user) => (
            <div key={user._id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">Role: {user.role}</p>
              </div>
              <div className="space-x-2">
                {user.role === "User" && (
                  <Button onClick={() => handleUserAction(user._id, "promote")} size="sm">
                    Promote to Manager
                  </Button>
                )}
                {user.role === "Manager" && (
                  <Button onClick={() => handleUserAction(user._id, "demote")} size="sm" variant="outline">
                    Demote to User
                  </Button>
                )}
                <Button onClick={() => handleUserAction(user._id, "remove")} size="sm" variant="destructive">
                  Remove User
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Tenant"}
          </Button>
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to {confirmAction?.action} this user? This action{" "}
              {confirmAction?.action === "remove" ? "cannot" : "can"} be undone.
            </p>
            <p>Please type the tenant name to confirm:</p>
            <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Enter tenant name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={confirmAction?.action === "remove" ? "destructive" : "default"}
              onClick={confirmUserAction}
              disabled={confirmationText !== tenant.name}
            >
              Confirm {confirmAction?.action}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}

