"use client"

import { withRoleProtection } from "./withRoleProtection"
import AdminDashboardContent from "./AdminDashboardContent"

function ProtectedAdminDashboard() {
  return <AdminDashboardContent />
}

export default withRoleProtection(ProtectedAdminDashboard, ["Admin"])

