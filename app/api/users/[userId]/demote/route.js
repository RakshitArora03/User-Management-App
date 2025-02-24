import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import User from "@/models/User"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req, { params }) {
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
      return NextResponse.json({ message: "Cannot modify admin users" }, { status: 400 })
    }

    user.role = "User"
    await user.save()

    return NextResponse.json({ message: "User demoted successfully" })
  } catch (error) {
    console.error("Error demoting user:", error)
    return NextResponse.json({ message: "Error demoting user" }, { status: 500 })
  }
}

