'use client'

import { useRouter } from 'next/navigation'
import { useAuth, SignInButton } from '@clerk/nextjs'
import { ProjectSubmissionForm } from '@/app/components/ProjectSubmissionForm'
import { Button } from '@/app/components/ui/button'
import type { Project } from '@/app/types'
import { LoadingScreen } from '@/app/components/ui/loading-spinner'

export default function SubmitProjectPage() {
  const router = useRouter()
  const { userId, isLoaded } = useAuth()
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleProjectSubmitted = (project: Project) => {
    // Navigate to discover page after successful submission
    router.push('/discover')
  }
  
  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return <LoadingScreen />
  }
  
  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <div className="mb-8 pt-20">
        <h1 className="text-3xl font-bold mb-2">Submit Your Project</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Share your project with the community and get feedback from other builders.
        </p>
      </div>
      
      {userId ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-sm">
          <ProjectSubmissionForm onSubmitSuccess={handleProjectSubmitted} />
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-sm text-center">
          <h2 className="text-xl font-semibold mb-4">Sign in to submit your project</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be signed in to submit a project to the community.
          </p>
          <SignInButton mode="modal">
            <Button size="lg">Sign In</Button>
          </SignInButton>
        </div>
      )}
    </div>
  )
} 