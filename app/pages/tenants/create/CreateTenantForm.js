"use client"

import { useState } from "react"
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
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  adminEmail: z.string().email("Invalid email address"),
  industryType: z.string().min(1, "Please select an industry type"),
  country: z.string().min(1, "Please select a country"),
  description: z.string().optional(),
})

const industryTypes = ["Technology", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "Other"]

const countries = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "Other"]

export default function CreateTenantForm({ user }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [tenantCode, setTenantCode] = useState("")
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      adminEmail: user.email,
    },
  })

  // Watch the name field to auto-generate slug
  const name = watch("name")
  const generateSlug = (name) => {
    return name
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
  }

  // Update slug when name changes
  useState(() => {
    if (name) {
      setValue("slug", generateSlug(name))
    }
  }, [name])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create tenant")
      }

      const result = await response.json()
      setTenantCode(result.tenantCode)
      setShowSuccessModal(true)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 bg-white p-6 rounded-lg shadow">
          <div>
            <Label htmlFor="name">Tenant Name *</Label>
            <Input id="name" {...register("name")} className={errors.name ? "border-red-500" : ""} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="slug">Tenant Slug *</Label>
            <Input id="slug" {...register("slug")} className={errors.slug ? "border-red-500" : ""} />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <Label htmlFor="adminEmail">Admin Email *</Label>
            <Input id="adminEmail" {...register("adminEmail")} className={errors.adminEmail ? "border-red-500" : ""} />
            {errors.adminEmail && <p className="text-red-500 text-sm mt-1">{errors.adminEmail.message}</p>}
          </div>

          <div>
            <Label htmlFor="industryType">Industry Type *</Label>
            <Select onValueChange={(value) => setValue("industryType", value)} defaultValue="">
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
            <Select onValueChange={(value) => setValue("country", value)} defaultValue="">
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

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Tenant"}
            </Button>
          </div>
        </div>
      </form>

      <Dialog open={showSuccessModal} onOpenChange={(open) => setShowSuccessModal(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tenant Created Successfully</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Your tenant has been created successfully. The tenant code is:</p>
            <p className="text-2xl font-bold text-center my-4">{tenantCode}</p>
            <p>Please save this code. You&apos;ll need to share it with users who want to join this tenant.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => router.push("/pages/tenants")}>Go to Tenants</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

