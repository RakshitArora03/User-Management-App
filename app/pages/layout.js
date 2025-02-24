"use client"

import { useState } from "react"
import { SideNavbar } from "@/components/SideNavbar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PagesLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen">
      <div
        className={`md:hidden ${sidebarOpen ? "block" : "hidden"} fixed inset-0 z-50 bg-gray-800/50`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
      >
        <SideNavbar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm md:hidden">
          <div className="px-4 py-2">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  )
}

