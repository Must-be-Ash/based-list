"use client"

import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { motion } from "framer-motion"
import { LogIn } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useEffect, Suspense } from "react"

function LoginPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()
  const redirectUrl = searchParams.get('redirect_url') || '/'

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push(redirectUrl)
    }
  }, [isLoaded, isSignedIn, redirectUrl, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full px-4"
      >
        <div className="text-center space-y-6 mb-8">
          <h1 className="text-4xl font-bold text-[#0052FF]">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to manage your profile and connect with other builders on Base.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-0">
          <div className="flex flex-col items-center space-y-4">
            <SignInButton mode="modal">
              <Button
                size="lg"
                className="w-full bg-[#0052FF] text-white hover:bg-[#0052FF]/90 text-lg px-8 py-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </Button>
            </SignInButton>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Secure authentication powered by Clerk
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <SignUpButton mode="modal">
            <button className="text-[#0052FF] hover:underline">
              Sign up
            </button>
          </SignUpButton>
        </p>
      </motion.div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0052FF]"></div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <LoginPageContent />
    </Suspense>
  )
} 