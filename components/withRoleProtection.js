"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function withRoleProtection(WrappedComponent, allowedRoles) {
  return function ProtectedRoute(props) {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
      if (status === "loading") return

      if (!session) {
        router.replace("/auth/signin")
        return
      }

      const userRole = localStorage.getItem("userRole") || session.user.role

      if (!allowedRoles.includes(userRole)) {
        router.replace("/unauthorized")
      } else {
        setIsAuthorized(true)
      }
    }, [status, session, router, allowedRoles])

    if (status === "loading" || !isAuthorized) {
      return <div>Loading...</div>
    }

    return <WrappedComponent {...props} />
  }
}

