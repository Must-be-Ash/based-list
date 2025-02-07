import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('__clerk_status')

    if (status === 'verified') {
      // If the user was successfully verified, redirect to onboarding
      return NextResponse.redirect(new URL("/onboarding", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"))
    }

    // If verification failed or any other case, redirect to home
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"))
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"))
  }
} 