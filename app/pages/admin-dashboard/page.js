import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import AdminDashboardClient from "./AdminDashboardClient"

export default async function AdminDashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  // Initial role check on server
  if (session.user.role !== "Admin") {
    redirect("/unauthorized")
  }

  return <AdminDashboardClient user={session.user} />
}

