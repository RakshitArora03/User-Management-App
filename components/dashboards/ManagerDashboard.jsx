"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function ManagerDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated" && session.user.role !== "Manager") {
      router.replace("/unauthorized")
    }
  }, [status, session, router])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== "Manager") {
    return null
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
      {/* Add manager-specific content here */}
    </div>
  )
}

