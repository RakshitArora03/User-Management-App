import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import User from "@/models/User"
import Tenant from "@/models/Tenant"
import { sendInvitationEmail } from "@/lib/email"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "Admin" && session.user.role !== "Manager")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { tenantId, role } = await req.json()

    const { userId } = await params

    if (!tenantId || !role || !userId) {
      return NextResponse.json({ message: "Tenant ID, role, and user ID are required" }, { status: 400 })
    }

    await clientPromise

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const tenant = await Tenant.findById(tenantId)
    if (!tenant) {
      return NextResponse.json({ message: "Tenant not found" }, { status: 404 })
    }

    try {
      // Send invitation email
      await sendInvitationEmail(user.email, tenant.name, tenant.tenantCode, role)
    } catch (emailError) {
      console.error("Error sending email:", emailError)
      return NextResponse.json(
        { message: "Invitation created but failed to send email. Please check your email configuration." },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        message: "Invitation sent successfully",
        tenantCode: tenant.tenantCode,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error sending invitation:", error)
    return NextResponse.json(
      {
        message: "An error occurred while sending the invitation",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

