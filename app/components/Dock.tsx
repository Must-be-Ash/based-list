"use client"

import Link from "next/link"
import { Home, Library, UserCircle, Globe, Search } from "lucide-react"
import { Dock as DockContainer, DockIcon } from "./ui/dock"
import { usePathname } from "next/navigation"

export const Dock = () => {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === '/builders' && pathname === '/builders') return true
    if (path === '/discover' && pathname.startsWith('/discover')) return true
    if (path === '/resources' && pathname.startsWith('/resources')) return true
    if (path === '/lookup' && pathname.startsWith('/lookup')) return true
    if (path === '/profile' && (pathname === '/profile' || pathname.startsWith('/profile/'))) return true
    return false
  }
  
  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center p-2 z-50 pointer-events-none">
      <DockContainer className="pointer-events-auto">
        <Link href="/builders">
          <DockIcon className={`${isActive('/builders') ? 'text-[#0052FF]' : 'text-[#393939] hover:text-[#0052FF]'} bg-white/80 dark:bg-black/80`}>
            <Home className="size-6" />
          </DockIcon>
        </Link>
        
        <Link href="/discover">
          <DockIcon className={`${isActive('/discover') ? 'text-[#0052FF]' : 'text-[#393939] hover:text-[#0052FF]'} bg-white/80 dark:bg-black/80`}>
            <Globe className="size-6" />
          </DockIcon>
        </Link>
        
        <Link href="/resources">
          <DockIcon className={`${isActive('/resources') ? 'text-[#0052FF]' : 'text-[#393939] hover:text-[#0052FF]'} bg-white/80 dark:bg-black/80`}>
            <Library className="size-6" />
          </DockIcon>
        </Link>
        
        <Link href="/lookup">
          <DockIcon className={`${isActive('/lookup') ? 'text-[#0052FF]' : 'text-[#393939] hover:text-[#0052FF]'} bg-white/80 dark:bg-black/80`}>
            <Search className="size-6" />
          </DockIcon>
        </Link>
        
        <Link href="/profile">
          <DockIcon className={`${isActive('/profile') ? 'text-[#0052FF]' : 'text-[#393939] hover:text-[#0052FF]'} bg-white/80 dark:bg-black/80`}>
            <UserCircle className="size-6" />
          </DockIcon>
        </Link>
      </DockContainer>
    </div>
  )
}

