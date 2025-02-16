import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-3xl font-bold">Welcome to your Dashboard</h1>
      <p className="text-lg">You are signed in as {session.user?.name || session.user?.email}</p>
      <p className="text-sm text-gray-500">User ID: {session.user?.id}</p>
    </div>
  )
}

