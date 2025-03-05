'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="relative">
        {/* Outer circle */}
        <div 
          className={cn(
            sizeClasses[size], 
            'rounded-full border-4 border-t-[#0052FF] border-r-[#0052FF/30] border-b-[#0052FF/10] border-l-[#0052FF/60]',
            'animate-spin'
          )}
        />
        
        {/* Inner pulse */}
        <div 
          className={cn(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'rounded-full bg-[#0052FF/30]',
            'animate-pulse',
            size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-5 h-5' : 'w-8 h-8'
          )}
        />
      </div>
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center min-h-screen bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50">
      <LoadingSpinner size="lg" />
      <p className="text-[#0052FF] font-medium animate-pulse mt-4">Loading...</p>
    </div>
  )
} 