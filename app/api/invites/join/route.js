import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import InviteCode from "@/models/InviteCode"
import User from "@/models/User"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { inviteCode } = await req.json()

    if (!inviteCode) {
      return NextResponse.json({ message: "Invite code is required" }, { status: 400 })
    }

    await clientPromise

    const invite = await InviteCode.findOne({
      code: inviteCode,
      expiresAt: { $gt: new Date() },
      usedBy: null,
    })

    if (!invite) {
      return NextResponse.json({ message: "Invalid or expired invite code" }, { status: 400 })
    }

    // Update user's tenant and role
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        tenantId: invite.tenantId,
        role: invite.role,
      },
      { new: true },
    )

    // Mark invite as used
    invite.usedBy = session.user.id
    await invite.save()

    // Update session
    session.user.role = updatedUser.role
    session.user.tenantId = updatedUser.tenantId

    return NextResponse.json(
      {
        message: "Successfully joined tenant",
        user: {
          role: updatedUser.role,
          tenantId: updatedUser.tenantId,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error joining tenant:", error)
    return NextResponse.json({ message: "An error occurred while joining the tenant" }, { status: 500 })
  }
}

