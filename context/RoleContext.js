"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"

const RoleContext = createContext()

export function RoleProvider({ children }) {
  const { data: session, status } = useSession()
  const [role, setRole] = useState(null)

  useEffect(() => {
    if (status === "authenticated") {
      const userRole = session.user.role
      setRole(userRole)
      localStorage.setItem("userRole", userRole)
    } else if (status === "unauthenticated") {
      setRole(null)
      localStorage.removeItem("userRole")
    }
  }, [status, session])

  const updateRole = (newRole) => {
    setRole(newRole)
    localStorage.setItem("userRole", newRole)
  }

  return <RoleContext.Provider value={{ role, setRole: updateRole }}>{children}</RoleContext.Provider>
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}

