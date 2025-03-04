'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '../components/ui/button'
import Link from 'next/link'
import { DiscoverProjectCard } from '../components/DiscoverProjectCard'
import { PlusCircle } from 'lucide-react'
import type { Project } from '../types'

export default function DiscoverPage() {
  const { userId } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])

  // Fetch projects when the component mounts
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error))
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 pt-20">
        <h1 className="text-3xl font-bold">Discover Projects</h1>
        {userId && (
          <Button 
            asChild 
            size="lg"
            className="bg-[#0052FF] hover:bg-[#0052FF]/90 text-white font-medium rounded-xl shadow-md transition-all hover:shadow-lg flex items-center gap-2 relative z-[60]"
          >
            <Link href="/discover/submit">
              <PlusCircle className="w-5 h-5" />
              Submit Your Project
            </Link>
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No projects have been submitted yet. Be the first to share your project!
          </p>
          {userId && (
            <Button 
              asChild 
              size="lg"
              className="bg-[#0052FF] hover:bg-[#0052FF]/90 text-white font-medium rounded-xl shadow-md transition-all hover:shadow-lg flex items-center gap-2 relative z-[60]"
            >
              <Link href="/discover/submit">
                <PlusCircle className="w-5 h-5" />
                Submit a Project
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <DiscoverProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
} 