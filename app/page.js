import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <main className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to User Management App</h1>
        <p className="mb-8 text-xl">Manage your users efficiently and securely.</p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

