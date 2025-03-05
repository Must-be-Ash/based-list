'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card } from './ui/card'
import { ExternalLink, Github } from 'lucide-react'
import { UpvoteButton } from './UpvoteButton'
import type { Project } from '../types'

interface DiscoverProjectCardProps {
  project: Project
}

export function DiscoverProjectCard({ project }: DiscoverProjectCardProps) {
  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-zinc-900 h-full flex flex-col group border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-200 dark:hover:border-blue-800">
      <Link href={`/projects/${project._id}`} className="flex-grow p-6 flex flex-col">
        <div className="flex items-center gap-5">
          {project.logo ? (
            <div className="relative w-[64px] h-[64px] rounded-xl shadow-sm overflow-hidden">
              <Image
                src={project.logo}
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-[64px] h-[64px] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-xl font-bold text-blue-500">{project.name[0]}</span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{project.description}</p>
          </div>
        </div>
      </Link>
      
      <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 mt-auto">
        <div className="flex items-center gap-2">
          {project.builderImage ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden">
              <Image
                src={project.builderImage}
                alt={project.builderName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-gray-500">{project.builderName[0]}</span>
            </div>
          )}
          <span className="text-sm text-gray-600 dark:text-gray-300">
            by <span className="font-medium">{project.builderName}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div onClick={handleActionClick}>
            <UpvoteButton 
              projectId={project._id} 
              initialUpvoteCount={project.upvoteCount || 0}
              size="sm"
              className="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all rounded-xl shadow-sm hover:shadow"
            />
          </div>
          
          {project.websiteUrl && (
            <a 
              href={project.websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              aria-label="Visit website"
            >
              <ExternalLink className="h-4 w-4" />
              Website
            </a>
          )}
          
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              aria-label="View GitHub"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </Card>
  )
} 