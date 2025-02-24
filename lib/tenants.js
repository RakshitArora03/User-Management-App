import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function getTenantForUser(userId) {
  const client = await clientPromise
  const db = client.db("assignment")

  const userTenant = await db.collection("userTenants").findOne({ userId: new ObjectId(userId) })

  if (!userTenant) {
    return null
  }

  const tenant = await db.collection("tenants").findOne({ _id: userTenant.tenantId })

  return tenant
}

