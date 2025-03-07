import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
      <p className="text-xl mb-8">You do not have permission to access this page.</p>
      <Button asChild>
        <Link href="/pages/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  )
}

