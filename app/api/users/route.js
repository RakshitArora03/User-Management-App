import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import User from "@/models/User"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "Admin" && session.user.role !== "Manager")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await clientPromise // Ensure MongoDB connection is established

    let users
    if (session.user.role === "Admin") {
      // Admins can see all users except other admins
      users = await User.find({ role: { $ne: "Admin" } }).lean()
    } else {
      // Managers can only see users in their tenant, excluding admins
      users = await User.find({
        tenantId: session.user.tenantId,
        role: { $ne: "Admin" },
      }).lean()
    }

    const formattedUsers = users.map((user) => ({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      tenant: user.tenantId ? user.tenantId.toString() : null,
    }))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 })
  }
}

