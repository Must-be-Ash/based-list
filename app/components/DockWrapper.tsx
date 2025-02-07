"use client"

import { usePathname } from "next/navigation"
import { Dock } from "./Dock"

export function DockWrapper() {
  const pathname = usePathname()
  // Don't show dock on landing page
  if (pathname === '/') return null
  return <Dock />
} 
