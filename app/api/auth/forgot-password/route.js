import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import User from "@/models/User"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req) {
  try {
    const { email } = await req.json()

    await clientPromise // Ensure the MongoDB connection is established

    const user = await User.findOne({ email })

    if (!user) {
      // We don't want to reveal if the email exists or not for security reasons
      return NextResponse.json(
        { message: "If a user with that email exists, a password reset link has been sent." },
        { status: 200 },
      )
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour from now

    // Save the reset token and expiry to the user document
    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()

    // Send the password reset email
    await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json(
      { message: "If a user with that email exists, a password reset link has been sent." },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in forgot password:", error)
    return NextResponse.json({ message: "An error occurred while processing your request" }, { status: 500 })
  }
}

