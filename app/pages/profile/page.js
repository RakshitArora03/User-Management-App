import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

export default async function Profile() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <div className="bg-white shadow rounded-lg p-6 mt-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Name</h2>
            <p>{session.user?.name || "Not provided"}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Email</h2>
            <p>{session.user?.email}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">User ID</h2>
            <p className="text-sm text-gray-500">{session.user?.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

