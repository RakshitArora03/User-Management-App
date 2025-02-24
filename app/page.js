import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <main className="text-center">
        <h1 className="mb-4 text-3xl sm:text-4xl font-bold">Welcome to User Management App</h1>
        <p className="mb-8 text-lg sm:text-xl">Manage your users efficiently and securely.</p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

