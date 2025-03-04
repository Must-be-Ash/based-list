'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { ProjectEditForm } from '@/app/components/ProjectEditForm'
import { toast } from 'sonner'
import type { Project } from '@/app/types'

export default function EditProjectPage({ params }: { params: { projectId: string } }) {
  const router = useRouter()
  const { userId, isLoaded } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${params.projectId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            toast.error('Project not found')
            router.push('/discover')
            return
          }
          throw new Error('Failed to fetch project')
        }
        
        const data = await response.json()
        setProject(data)
      } catch (error) {
        console.error('Error fetching project:', error)
        toast.error('Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (isLoaded) {
      fetchProject()
    }
  }, [params.projectId, router, isLoaded])
  
  // Check if user is authorized to edit this project
  useEffect(() => {
    if (isLoaded && !isLoading && project && userId !== project.userId) {
      toast.error("You don't have permission to edit this project")
      router.push('/discover')
    }
  }, [isLoaded, isLoading, project, userId, router])
  
  const handleUpdateSuccess = (updatedProject: Project) => {
    setProject(updatedProject)
    // Navigate to the project page
    router.push(`/projects/${params.projectId}`)
  }
  
  const handleDeleteSuccess = () => {
    // Navigate to discover page after deletion
    router.push('/discover')
  }
  
  // Show loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    )
  }
  
  // Show error if project not found or user not authorized
  if (!project) {
    return null // Will redirect in useEffect
  }
  
  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <div className="mb-8 pt-20">
        <h1 className="text-3xl font-bold mb-2">Edit Project</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Update your project details or remove it from the platform.
        </p>
      </div>
      
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-sm">
        <ProjectEditForm 
          project={project} 
          onUpdateSuccess={handleUpdateSuccess}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </div>
    </div>
  )
} 