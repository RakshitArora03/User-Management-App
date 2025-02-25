import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import UserTenant from "@/models/UserTenant"
import User from "@/models/User"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await clientPromise

    const {id} = await params
    const userTenants = await UserTenant.find({ tenantId: id })
    const userIds = userTenants.map((ut) => ut.userId)

    const users = await User.find({ _id: { $in: userIds } })

    const usersWithRoles = users.map((user) => {
      const userTenant = userTenants.find((ut) => ut.userId.toString() === user._id.toString())
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: userTenant.role,
      }
    })

    return NextResponse.json(usersWithRoles)
  } catch (error) {
    console.error("Error fetching tenant users:", error)
    return NextResponse.json({ message: "Error fetching tenant users" }, { status: 500 })
  }
}

