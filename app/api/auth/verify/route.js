import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req) {
  try {
    const { token } = await req.json()

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.userId

    await clientPromise // Ensure the MongoDB connection is established

    const user = await User.findByIdAndUpdate(userId, { emailVerified: true })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error in email verification:", error)
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
  }
}

