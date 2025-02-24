"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CheckRole() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.replace("/auth/signin")
      return
    }

    // Store the user's role in localStorage
    localStorage.setItem("userRole", session.user.role)

    // Redirect based on role
    const role = session.user.role
    const rolePaths = {
      Admin: "/pages/admin-dashboard",
      Manager: "/pages/manager-dashboard",
      User: "/pages/dashboard",
    }

    const targetPath = rolePaths[role] || "/pages/dashboard"
    router.replace(targetPath)
  }, [status, session, router])

  // Show loading state while checking
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Checking permissions...</h2>
          <p className="text-gray-500">Please wait while we redirect you.</p>
        </div>
      </div>
    )
  }

  return null
}

