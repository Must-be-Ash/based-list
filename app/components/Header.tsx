"use client"

import Link from 'next/link'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

export function Header() {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16">
      <nav className="flex items-center gap-6">
        <Link href="/" className="text-lg font-semibold hover:text-gray-600 dark:hover:text-gray-300">
          Home
        </Link>
        <Link href="/discover" className="text-lg font-semibold hover:text-gray-600 dark:hover:text-gray-300">
          Discover
        </Link>
        <Link href="/resources" className="text-lg font-semibold hover:text-gray-600 dark:hover:text-gray-300">
          Resources
        </Link>
        <Link href="/builders" className="text-lg font-semibold hover:text-gray-600 dark:hover:text-gray-300">
          Builders
        </Link>
        <Link href="/lookup" className="text-lg font-semibold hover:text-gray-600 dark:hover:text-gray-300">
          Lookup
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </header>
  )
} 