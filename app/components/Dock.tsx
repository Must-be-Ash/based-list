"use client"

import Link from "next/link"
import { Home, Library, UserCircle } from "lucide-react"
import { Dock as DockContainer, DockIcon } from "./ui/dock"

export const Dock = () => {
  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center p-4 z-50">
      <DockContainer>
        <Link href="/builders">
          <DockIcon className="text-[#393939] hover:text-[#0052FF] bg-white/80 dark:bg-black/80">
            <Home className="size-6" />
          </DockIcon>
        </Link>
        
        <Link href="/resources">
          <DockIcon className="text-[#393939] hover:text-[#0052FF] bg-white/80 dark:bg-black/80">
            <Library className="size-6" />
          </DockIcon>
        </Link>
        
        <Link href="/profile">
          <DockIcon className="text-[#393939] hover:text-[#0052FF] bg-white/80 dark:bg-black/80">
            <UserCircle className="size-6" />
          </DockIcon>
        </Link>
      </DockContainer>
    </div>
  )
}

