import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import ManagerDashboardClient from "./ManagerDashboardClient"

export default async function ManagerDashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  // Initial role check on server
  if (session.user.role !== "Manager") {
    redirect("/unauthorized")
  }

  return <ManagerDashboardClient user={session.user} />
}

