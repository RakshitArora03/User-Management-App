import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import TenantsPage from "./TenantsPage"

export default async function Tenants() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  return <TenantsPage user={session.user} />
}

