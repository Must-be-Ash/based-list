import Link from "next/link"

export function LegalLinks() {
  return (
    <div className="w-full border-t border-gray-100 dark:border-gray-900 mb-16 relative z-20">
      <div className="max-w-7xl mx-auto px-4 py-3 text-center">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-x-4">
          <Link 
            href="/privacy" 
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Privacy Policy
          </Link>
          <span>·</span>
          <Link 
            href="/terms" 
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  )
} 