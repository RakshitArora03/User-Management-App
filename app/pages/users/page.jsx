import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import UsersTable from "./UsersTable"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Allow access for Admin and Manager roles
  if (session.user.role !== "Admin" && session.user.role !== "Manager") {
    redirect("/unauthorized")
  }

  return <UsersTable userRole={session.user.role} />
}

