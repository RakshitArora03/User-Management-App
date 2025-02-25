import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import clientPromise from "@/lib/mongodb"
import Tenant from "@/models/Tenant"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await clientPromise
    const {id} = await params 
    const tenant = await Tenant.findById(id)

    if (!tenant) {
      return NextResponse.json({ message: "Tenant not found" }, { status: 404 })
    }

    return NextResponse.json(tenant)
  } catch (error) {
    console.error("Error fetching tenant:", error)
    return NextResponse.json({ message: "Error fetching tenant" }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    await clientPromise
    const {id} = await params
    const tenant = await Tenant.findByIdAndUpdate(id, data, { new: true, runValidators: true })

    if (!tenant) {
      return NextResponse.json({ message: "Tenant not found" }, { status: 404 })
    }

    return NextResponse.json(tenant)
  } catch (error) {
    console.error("Error updating tenant:", error)
    return NextResponse.json({ message: "Error updating tenant" }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await clientPromise
    
    const {id} = await params

    const tenant = await Tenant.findByIdAndDelete(id)

    if (!tenant) {
      return NextResponse.json({ message: "Tenant not found" }, { status: 404 })
    }

    // TODO: Remove all user-tenant relationships for this tenant

    return NextResponse.json({ message: "Tenant deleted successfully" })
  } catch (error) {
    console.error("Error deleting tenant:", error)
    return NextResponse.json({ message: "Error deleting tenant" }, { status: 500 })
  }
}

