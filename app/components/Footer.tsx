import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full py-4 px-6 bg-white/30 dark:bg-black/30 backdrop-blur-xl z-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center sm:justify-center gap-1 sm:gap-3">
        <div className="flex items-center gap-3">
          <Image
            src="/nvg.svg"
            alt="Navigate Logo"
            width={24}
            height={24}
            className="dark:invert"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Built by{" "}
            <Link 
              href="https://x.com/navigate_ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-[#FF5F1F] hover:text-[#FF5F1F]/80"
            >
              Navigate
            </Link>
          </p>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 sm:before:content-['-'] sm:before:mx-1 sm:not-italic italic">
          the data marketplace for AI Agents built on Base
        </p>
      </div>
    </footer>
  )
} 
