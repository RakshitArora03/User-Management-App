import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import Tenant from "@/models/Tenant"
import UserTenant from "@/models/UserTenant"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { tenantCode } = await req.json()

    if (!tenantCode) {
      return NextResponse.json({ message: "Tenant code is required" }, { status: 400 })
    }

    await clientPromise

    // Find tenant by tenant code
    const tenant = await Tenant.findOne({ tenantCode })

    if (!tenant) {
      return NextResponse.json({ message: "Invalid tenant code" }, { status: 400 })
    }

    // Check if user is already a member of this tenant
    const existingMembership = await UserTenant.findOne({
      userId: session.user.id,
      tenantId: tenant._id,
    })

    if (existingMembership) {
      return NextResponse.json({ message: "You are already a member of this tenant" }, { status: 400 })
    }

    // Create user-tenant relationship with default role "User"
    await UserTenant.create({
      userId: session.user.id,
      tenantId: tenant._id,
      role: "User", // Default role for joining via tenant code
    })

    return NextResponse.json(
      {
        message: "Successfully joined tenant",
        tenant: {
          id: tenant._id,
          name: tenant.name,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error joining tenant:", error)
    return NextResponse.json({ message: "An error occurred while joining the tenant" }, { status: 500 })
  }
}

