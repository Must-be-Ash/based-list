'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth, SignInButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { GiGoat } from 'react-icons/gi'

interface UpvoteButtonProps {
  projectId: string
  initialUpvoteCount?: number
  initialUpvoted?: boolean
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function UpvoteButton({
  projectId,
  initialUpvoteCount = 0,
  initialUpvoted = false,
  className = '',
  size = 'default'
}: UpvoteButtonProps) {
  const { userId, isSignedIn, isLoaded } = useAuth()
  const [upvoted, setUpvoted] = useState(initialUpvoted)
  const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount)
  const [isLoading, setIsLoading] = useState(false)

  const fetchUpvoteStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/upvote`)
      if (response.ok) {
        const data = await response.json()
        setUpvoted(data.upvoted)
        setUpvoteCount(data.upvoteCount)
      }
    } catch (error) {
      console.error('Error fetching based status:', error)
    }
  }, [projectId])

  // Fetch initial upvote status when component mounts
  useEffect(() => {
    if (isSignedIn && isLoaded && userId) {
      fetchUpvoteStatus()
    }
  }, [isSignedIn, isLoaded, userId, fetchUpvoteStatus])

  const handleUpvote = async () => {
    if (!isSignedIn) {
      return // The button will show sign-in option for non-signed-in users
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/upvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUpvoted(data.upvoted)
        setUpvoteCount(data.upvoteCount)
        
        if (data.upvoted) {
          toast.success('Project marked as BASED! 🐐')
        } else {
          toast.success('BASED removed')
        }
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to mark as based')
      }
    } catch (error) {
      console.error('Error marking project as based:', error)
      toast.error('Failed to mark project as based')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <Button 
        variant="outline" 
        size={size}
        className={`gap-1.5 rounded-xl shadow-sm ${className}`} 
        disabled
      >
        <GiGoat className="w-5 h-5" />
        {upvoteCount}
      </Button>
    )
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button 
          variant="outline" 
          size={size}
          className={`gap-1.5 rounded-xl shadow-sm ${className}`}
        >
          <GiGoat className="w-5 h-5" />
          {upvoteCount}
        </Button>
      </SignInButton>
    )
  }

  return (
    <Button
      variant="outline"
      size={size}
      className={`gap-1.5 rounded-xl shadow-sm ${upvoted ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' : ''} ${className}`}
      onClick={handleUpvote}
      disabled={isLoading}
    >
      <GiGoat 
        className={`w-5 h-5 ${upvoted ? 'text-blue-600 dark:text-blue-400' : ''} ${upvoted ? 'scale-110 transition-transform' : ''}`} 
      />
      {upvoteCount}
    </Button>
  )
} 