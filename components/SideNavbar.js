"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Building2, Home, User, LogOut, Users, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRole } from "@/context/RoleContext"
import toast from "react-hot-toast"

const roleBasedNavItems = {
  Admin: [
    { name: "Dashboard", href: "/pages/dashboard", icon: Home },
    { name: "Tenants", href: "/pages/tenants", icon: Building2 },
    { name: "Users", href: "/pages/users", icon: Users },
    { name: "Settings", href: "/pages/settings", icon: Settings },
    { name: "Profile", href: "/pages/profile", icon: User },
  ],
  Manager: [
    { name: "Dashboard", href: "/pages/dashboard", icon: Home },
    { name: "Tenants", href: "/pages/tenants", icon: Building2 },
    { name: "Users", href: "/pages/users", icon: Users },
    { name: "Team", href: "/pages/team", icon: Users },
    { name: "Profile", href: "/pages/profile", icon: User },
  ],
  User: [
    { name: "Dashboard", href: "/pages/dashboard", icon: Home },
    { name: "Tenants", href: "/pages/tenants", icon: Building2 },
    { name: "Profile", href: "/pages/profile", icon: User },
  ],
}

export function SideNavbar() {
  const pathname = usePathname()
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const { role } = useRole()

  const navItems = roleBasedNavItems[role] || roleBasedNavItems.User

  const handleLogout = () => {
    setShowLogoutConfirmation(true)
  }

  const confirmLogout = async () => {
    await signOut({ callbackUrl: "/" })
    localStorage.removeItem("userRole")
    toast.success("Successfully logged out")
  }

  return (
    <>
      <nav className="w-64 bg-gray-800 text-white h-full flex flex-col">
        <div className="p-4">
          <h2 className="text-xl font-bold">User Management</h2>
        </div>

        <div className="flex-grow p-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors ${
                pathname === item.href ? "bg-gray-700" : ""
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 w-full text-left transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <Dialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>Are you sure you want to logout?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={confirmLogout}>Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

