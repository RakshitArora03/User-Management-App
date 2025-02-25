import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import UserTenant from "@/models/UserTenant"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await clientPromise

    const { id: tenantId, userId, action } = params

    const userTenant = await UserTenant.findOne({ tenantId, userId })

    if (!userTenant) {
      return NextResponse.json({ message: "User not found in this tenant" }, { status: 404 })
    }

    switch (action) {
      case "promote":
        if (userTenant.role === "Manager") {
          return NextResponse.json({ message: "User is already a Manager" }, { status: 400 })
        }
        userTenant.role = "Manager"
        break
      case "demote":
        if (userTenant.role === "User") {
          return NextResponse.json({ message: "User is already a regular User" }, { status: 400 })
        }
        userTenant.role = "User"
        break
      case "remove":
        await UserTenant.findByIdAndDelete(userTenant._id)
        return NextResponse.json({ message: "User removed from tenant successfully" })
      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    }

    await userTenant.save()

    return NextResponse.json({ message: `User ${action}d successfully` })
  } catch (error) {
    console.error(`Error ${params.action}ing user:`, error)
    return NextResponse.json({ message: `Error ${params.action}ing user` }, { status: 500 })
  }
}

