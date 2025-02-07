"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"

export default function OnboardingPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/")
    } else if (isLoaded && isSignedIn) {
      router.push("/profile")
    }
  }, [isLoaded, isSignedIn, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Setting up your profile...</h1>
        <p className="text-gray-600">Please wait while we get everything ready.</p>
      </div>
    </div>
  )
} 