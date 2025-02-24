import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import InviteCode from "@/models/InviteCode"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "Admin" && session.user.role !== "Manager")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { tenantId, role } = await req.json()

    if (!tenantId || !role) {
      return NextResponse.json({ message: "Tenant ID and role are required" }, { status: 400 })
    }

    await clientPromise

    const inviteCode = await InviteCode.create({
      tenantId,
      role,
    })

    return NextResponse.json({ inviteCode: inviteCode.code }, { status: 201 })
  } catch (error) {
    console.error("Error creating invite code:", error)
    return NextResponse.json({ message: "Error creating invite code" }, { status: 500 })
  }
}

