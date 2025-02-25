import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import EditTenantForm from "./EditTenantForm"

export default async function EditTenantPage({ params }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Only allow Admin users to edit tenants
  if (session.user.role !== "Admin") {
    redirect("/unauthorized")
  }

  const {id} = await params
  const tenantId = id

  if (!tenantId) {
    redirect("/pages/tenants")
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Tenant</h1>
      <EditTenantForm tenantId={tenantId} user={session.user} />
    </div>
  )
}

