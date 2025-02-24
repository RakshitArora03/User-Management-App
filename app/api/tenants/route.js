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

    // Ensure user is an Admin
    if (session.user.role !== "Admin") {
      return NextResponse.json({ message: "Only Admin users can create tenants" }, { status: 403 })
    }

    const data = await req.json()
    await clientPromise

    // Create new tenant
    const tenant = await Tenant.create({
      ...data,
      createdBy: session.user.id,
      // tenantCode will be automatically generated
    })

    return NextResponse.json(tenant, { status: 201 })
  } catch (error) {
    console.error("Error creating tenant:", error)
    if (error.code === 11000) {
      // Duplicate key error
      return NextResponse.json({ message: "A tenant with this name already exists" }, { status: 400 })
    }
    return NextResponse.json({ message: "Error creating tenant: " + error.message }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await clientPromise

    let tenants = []

    if (session.user.role === "Admin") {
      // Admins can see all tenants
      tenants = await Tenant.find().sort({ createdAt: -1 })
    } else {
      // Get tenants where the user is a member
      const userTenants = await UserTenant.find({ userId: session.user.id })
      const tenantIds = userTenants.map((ut) => ut.tenantId)
      tenants = await Tenant.find({ _id: { $in: tenantIds } }).sort({ createdAt: -1 })
    }

    // Add user's role in each tenant
    const tenantsWithRoles = await Promise.all(
      tenants.map(async (tenant) => {
        const userTenant = await UserTenant.findOne({
          userId: session.user.id,
          tenantId: tenant._id,
        })

        return {
          ...tenant.toObject(),
          userRole: userTenant?.role || session.user.role,
        }
      }),
    )

    return NextResponse.json(tenantsWithRoles)
  } catch (error) {
    console.error("Error fetching tenants:", error)
    return NextResponse.json({ message: "Error fetching tenants" }, { status: 500 })
  }
}

