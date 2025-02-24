import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import User from "@/models/User"

const ADMIN_EMAIL = "admin@example.com"
const ADMIN_PASSWORD = "secureAdminPassword123!" // Change this to a secure password
const SEED_SECRET = process.env.SEED_SECRET || "defaultSeedSecret"

export async function POST(req) {
  // Check if we're in development or if the correct secret is provided
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get("secret")
  if (process.env.NODE_ENV !== "development" && secret !== SEED_SECRET) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 })
  }

  try {
    await clientPromise // Ensure the MongoDB connection is established

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL })
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin user already exists" }, { status: 200 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

    // Create the admin user
    const adminUser = new User({
      name: "Admin User",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "Admin",
      emailVerified: true,
    })

    await adminUser.save()

    return NextResponse.json({ message: "Admin user created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error seeding admin user:", error)
    return NextResponse.json({ error: "An error occurred while seeding admin user" }, { status: 500 })
  }
}

