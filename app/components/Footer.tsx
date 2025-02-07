import Image from "next/image"
import Link from "next/link"
import { AnimatedShinyText } from "./animated-shiny-text"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full py-4 px-6 bg-white/30 dark:bg-black/30 backdrop-blur-xl z-10">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2">
        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Image
              src="/nvg.svg"
              alt="Navigate Logo"
              width={24}
              height={24}
              className="dark:invert"
            />
            <AnimatedShinyText className="text-sm">
              Built by{" "}
              <Link 
                href="https://x.com/navigate_ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-[#FF5F1F] hover:text-[#FF5F1F]/80"
              >
                Navigate
              </Link>
            </AnimatedShinyText>
          </div>
          <span className="hidden sm:inline mx-2 text-gray-400">-</span>
          <AnimatedShinyText className="text-sm">
            the data marketplace for AI Agents built on Base
          </AnimatedShinyText>
        </div>
      </div>
    </footer>
  )
} 
