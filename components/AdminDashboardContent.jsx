"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function AdminDashboardContent() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.replace("/auth/signin")
      return
    }

    const userRole = localStorage.getItem("userRole") || session.user.role

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
    <div>
      <h1>Admin Dashboard</h1>
      {/* Admin dashboard content */}
    </div>
  )
}

