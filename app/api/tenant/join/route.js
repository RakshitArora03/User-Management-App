import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import User from "@/models/User"
import Tenant from "@/models/Tenant"

export async function POST(req) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { tenantId } = await req.json()

    await clientPromise // Ensure the MongoDB connection is established

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const tenant = await Tenant.findById(tenantId)
    if (!tenant) {
      return NextResponse.json({ message: "Tenant not found" }, { status: 404 })
    }

    user.tenantId = tenant._id
    await user.save()

    return NextResponse.json({ message: "Successfully joined tenant" }, { status: 200 })
  } catch (error) {
    console.error("Error in join tenant:", error)
    return NextResponse.json({ message: "An error occurred while joining the tenant" }, { status: 500 })
  }
}

