import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import User from "@/models/User"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await clientPromise

    const user = await User.findById(params.userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (user.role === "Admin") {
      return NextResponse.json({ message: "Cannot delete admin users" }, { status: 400 })
    }

    await User.findByIdAndDelete(params.userId)

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ message: "Error deleting user" }, { status: 500 })
  }
}

