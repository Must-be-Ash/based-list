import Link from "next/link"
import Image from "next/image"
import { Button } from "@/app/components/ui/button"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { ArrowRight } from "lucide-react"
import { Ripple } from "@/app/components/ripple"
import { LegalLinks } from "./components/LegalLinks"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navigation */}
      <nav className="absolute top-0 right-0 p-6 z-20">
        <SignedIn>
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" className="text-gray-600 hover:text-[#0052FF]">
                My Profile
              </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </nav>

      {/* Ripple Background */}
      <div className="fixed inset-0 flex items-center justify-center">
        <Ripple 
          className="opacity-90" 
          mainCircleSize={600} 
          numCircles={8} 
          mainCircleOpacity={0.7} 
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Hero section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl sm:text-8xl font-bold mb-6 sm:mb-8 text-[#0052FF] flex items-center justify-center">
              Based List
              <div className="relative group ml-6 -mb-2 hidden sm:block">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#0052FF] to-[#0043CC] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <Image
                  src="/Base_Network_Logo.svg"
                  alt="Base Network"
                  width={80}
                  height={80}
                  className="dark:invert relative transform group-hover:scale-110 transition duration-300"
                />
              </div>
            </h1>
            <h2 className="text-2xl sm:text-4xl font-semibold mb-8 sm:mb-12 text-gray-700 dark:text-gray-300">
              A directory of builders on Base
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" className="bg-[#0052FF] text-white hover:bg-[#0052FF]/90 text-lg sm:text-xl px-6 sm:px-10 py-6 sm:py-8 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto">
                    Get Started <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/profile">
                  <Button size="lg" className="bg-[#0052FF] text-white hover:bg-[#0052FF]/90 text-lg sm:text-xl px-6 sm:px-10 py-6 sm:py-8 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto">
                    Go to Profile <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </Link>
              </SignedIn>
              <Link href="/builders" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-[#0052FF] border-[#0052FF] hover:bg-[#0052FF]/10 text-lg sm:text-xl px-6 sm:px-10 py-6 sm:py-8 rounded-xl sm:rounded-2xl backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all w-full"
                >
                  Explore Builders
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="relative z-[5] mb-10">
          <LegalLinks />
        </div>
      </main>
    </div>
  )
}

