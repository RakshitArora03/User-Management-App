import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import CreateTenantForm from "./CreateTenantForm"

export default async function CreateTenantPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Only allow Admin users to create tenants
  if (session.user.role !== "Admin") {
    redirect("/unauthorized")
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Tenant</h1>
      <CreateTenantForm user={session.user} />
    </div>
  )
}

