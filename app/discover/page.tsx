'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '../components/ui/button'
import { Dialog } from '../components/ui/dialog'
import { DiscoverProjectCard } from '../components/DiscoverProjectCard'
import { ProjectSubmissionForm } from '../components/ProjectSubmissionForm'
import type { Project } from '../types'

export default function DiscoverPage() {
  const { userId } = useAuth()
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])

  // Fetch projects when the component mounts
  useState(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error))
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Discover Projects</h1>
        {userId && (
          <Button onClick={() => setIsSubmitOpen(true)}>
            Submit Your Project
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <DiscoverProjectCard key={project._id} project={project} />
        ))}
      </div>

      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Submit Your Project</h2>
            <ProjectSubmissionForm />
          </div>
        </div>
      </Dialog>
    </div>
  )
} 