"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

export default function VerifyEmail() {
  const [verifying, setVerifying] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    }
  }, [token])

  const verifyEmail = async (token) => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        toast.success("Email verified successfully")
        setTimeout(() => router.push("/auth/signin"), 2000)
      } else {
        const data = await response.json()
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("An error occurred during email verification")
    } finally {
      setVerifying(false)
    }
  }

  if (verifying) {
    return <div className="text-center">Verifying your email...</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md text-center">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Verification</h2>
        <p>Your email has been verified. You can now sign in.</p>
        <Button onClick={() => router.push("/auth/signin")}>Go to Sign In</Button>
      </div>
    </div>
  )
}

