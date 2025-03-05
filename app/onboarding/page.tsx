"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"
import { LoadingScreen } from "@/app/components/ui/loading-spinner"

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

  return <LoadingScreen />
} 