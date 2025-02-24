import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import User from "@/models/User"
import { sendVerificationEmail } from "@/lib/email"
import jwt from "jsonwebtoken"

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

    await clientPromise // Ensure the MongoDB connection is established

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
      role: "User", // Assign 'User' role by default
    })

    // Generate verification token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

    // Send verification email
    await sendVerificationEmail(email, token)

    return NextResponse.json(
      { message: "User created successfully. Please check your email for verification." },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error in signup:", error)
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 })
  }
}

